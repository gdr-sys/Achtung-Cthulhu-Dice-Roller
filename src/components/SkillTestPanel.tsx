import { useState, useCallback, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from './ui/Card';
import { NumberInput } from './ui/NumberInput';
import { OptionTile } from './ui/OptionTile';
import { Button } from './ui/Button';
import { D20Die } from './dice/D20Die';
import { rollSkillTest, rollAssist, SkillRollResult, D20Result } from '../utils/diceRoller';
import { ResourceTrackers } from './ResourceTrackers';

interface SkillTestPanelProps {
  onRoll?: (result: SkillRollResult) => void;
}

export function SkillTestPanel({ onRoll }: SkillTestPanelProps) {
  const { t } = useApp();
  
  // Main form state
  const [attribute, setAttribute] = useState(8);
  const [skill, setSkill] = useState(4);
  const [tnBonus, setTnBonus] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [injuries, setInjuries] = useState(0);
  const [extraDice, setExtraDice] = useState(0);
  const [hasFocus, setHasFocus] = useState(false);
  const [useFortune, setUseFortune] = useState(false);
  const [isOpposed, setIsOpposed] = useState(false);
  
  // Manual range overrides
  const [critRangeOverride, setCritRangeOverride] = useState<number | null>(null);
  const [compRangeOverride, setCompRangeOverride] = useState<number | null>(null);
  
  // Assist state
  const [assistAttr, setAssistAttr] = useState(7);
  const [assistSkill, setAssistSkill] = useState(3);
  const [assistFocus, setAssistFocus] = useState(false);
  const [assistDice, setAssistDice] = useState(0);
  const [assistResult, setAssistResult] = useState<{ dice: D20Result[]; extraDice: number; complications: number } | null>(null);
  
  // Advanced panel
  const [advancedOpen, setAdvancedOpen] = useState(false);
  
  // Roll result
  const [result, setResult] = useState<SkillRollResult | null>(null);
  const [rollKey, setRollKey] = useState(0); // Key to force re-animation

  // Computed values
  const targetNumber = useMemo(() => Math.max(1, attribute + skill + tnBonus), [attribute, skill, tnBonus]);
  const autoCritMax = useMemo(() => hasFocus ? Math.max(1, skill) : 1, [hasFocus, skill]);
  const autoCompRange = useMemo(() => Math.max(16, 20 - injuries), [injuries]);
  
  const criticalMax = critRangeOverride ?? autoCritMax;
  const complicationRange = compRangeOverride ?? autoCompRange;
  const effectiveDifficulty = isOpposed ? 1 : difficulty;

  const handleCritRangeChange = useCallback((val: number) => {
    const clamped = Math.max(1, Math.min(20, val));
    if (clamped === autoCritMax) {
      setCritRangeOverride(null);
    } else {
      setCritRangeOverride(clamped);
    }
  }, [autoCritMax]);

  const handleCompRangeChange = useCallback((val: number) => {
    const clamped = Math.max(16, Math.min(20, val));
    if (clamped === autoCompRange) {
      setCompRangeOverride(null);
    } else {
      setCompRangeOverride(clamped);
    }
  }, [autoCompRange]);

  const handleRollAssist = useCallback(() => {
    const result = rollAssist({
      attribute: assistAttr,
      skill: assistSkill,
      hasFocus: assistFocus,
      complicationRange
    });
    setAssistResult(result);
    setAssistDice(Math.min(3 - extraDice, result.extraDice));
  }, [assistAttr, assistSkill, assistFocus, complicationRange, extraDice]);

  const handleRoll = useCallback(() => {
    setRollKey(prev => prev + 1);
    const rollResult = rollSkillTest({
      attribute,
      skill,
      tnBonus,
      difficulty: effectiveDifficulty,
      extraDice,
      hasFocus,
      useFortune,
      complicationRange,
      criticalMax,
      assistDice
    });
    setResult(rollResult);
    onRoll?.(rollResult);
  }, [attribute, skill, tnBonus, effectiveDifficulty, extraDice, hasFocus, useFortune, complicationRange, criticalMax, assistDice, onRoll]);

  return (
    <div className="w-full max-w-[390px]">
      <Card title={t.cardMain} icon="🎯">
        {/* Attribute & Skill */}
        <div className="grid grid-cols-2 gap-2.5 mb-3.5">
          <NumberInput
            label={t.lblAttr}
            value={attribute}
            onChange={setAttribute}
            min={1}
            max={15}
          />
          <NumberInput
            label={t.lblSkill}
            value={skill}
            onChange={setSkill}
            min={0}
            max={10}
          />
        </div>

        {/* TN Bonus */}
        <div className="flex items-center gap-2 mb-2.5">
          <label className="font-mono text-[0.65rem] text-muted uppercase font-extrabold tracking-wider whitespace-nowrap">
            {t.lblTnBonus}
          </label>
          <input
            type="number"
            value={tnBonus}
            onChange={(e) => setTnBonus(parseInt(e.target.value) || 0)}
            min={-10}
            max={10}
            className="w-16 px-2.5 py-2 bg-input-bg border border-border rounded text-text font-mono outline-none focus:border-primary transition-colors"
          />
          <span className="font-mono text-[0.65rem] text-muted flex-1 leading-tight">
            {t.lblTnHint}
          </span>
        </div>

        {/* Target Number Display */}
        <div className="bg-input-bg border border-border rounded p-2.5 mb-3.5 flex justify-between items-center">
          <span className="font-mono text-[0.72rem] text-muted uppercase tracking-wider">
            {t.lblTargetNum}
          </span>
          <span className="font-mono text-2xl font-black text-primary">
            {targetNumber}
          </span>
        </div>

        {/* Difficulty & Injuries */}
        <div className="grid grid-cols-2 gap-2.5 mb-3.5">
          <NumberInput
            label={t.lblDifficulty}
            value={difficulty}
            onChange={setDifficulty}
            min={0}
            max={5}
          />
          <NumberInput
            label={t.lblInjuries}
            value={injuries}
            onChange={setInjuries}
            min={0}
            max={5}
          />
        </div>

        {/* Critical & Complication Ranges */}
        <div className="grid grid-cols-2 gap-2 mb-3.5">
          <div className="bg-input-bg border border-primary rounded p-2.5">
            <label className="font-mono text-[0.65rem] text-muted uppercase font-extrabold tracking-wider block mb-1.5">
              {t.lblCritRange}
            </label>
            <input
              type="number"
              value={criticalMax}
              onChange={(e) => handleCritRangeChange(parseInt(e.target.value) || 1)}
              min={1}
              max={20}
              className="w-full px-2.5 py-2 bg-card border border-primary rounded text-primary font-mono font-black text-lg text-center outline-none"
            />
            <div className="font-mono text-[0.6rem] text-muted mt-1 leading-tight">
              {criticalMax === 1 ? t.critHintNoFocus : `${t.critHintFocus}${criticalMax}`}
            </div>
          </div>
          <div className="bg-input-bg border border-complication rounded p-2.5">
            <label className="font-mono text-[0.65rem] text-muted uppercase font-extrabold tracking-wider block mb-1.5">
              {t.lblCompRangeLabel}
            </label>
            <input
              type="number"
              value={complicationRange}
              onChange={(e) => handleCompRangeChange(parseInt(e.target.value) || 20)}
              min={16}
              max={20}
              className="w-full px-2.5 py-2 bg-card border border-complication rounded text-complication font-mono font-black text-lg text-center outline-none"
            />
            <div className="font-mono text-[0.6rem] text-muted mt-1 leading-tight">
              {t.lblCompHint}
            </div>
          </div>
        </div>

        {/* Extra Dice */}
        <NumberInput
          label={`${t.lblExtraDice}${assistDice > 0 ? ` (+${assistDice} assist)` : ''}`}
          value={extraDice}
          onChange={setExtraDice}
          min={0}
          max={3}
          className="mb-3.5"
        />

        <hr className="border-none border-t border-border my-3.5" />

        {/* Focus */}
        <OptionTile checked={hasFocus} onChange={setHasFocus}>
          🎯 {t.lblFocus}
        </OptionTile>

        {/* Roll Button */}
        <Button onClick={handleRoll} className="mt-2.5">
          {t.btnRoll}
        </Button>
      </Card>

      {/* Advanced Options Toggle */}
      <button
        onClick={() => setAdvancedOpen(!advancedOpen)}
        className={`w-full max-w-[390px] flex items-center justify-between bg-card border border-border rounded p-3 cursor-pointer font-mono text-[0.72rem] font-extrabold text-primary uppercase tracking-wider transition-all hover:border-primary ${
          advancedOpen ? 'border-primary rounded-b-none border-b-0 mb-0' : 'mb-3'
        }`}
      >
        <span>{t.lblAdvanced}</span>
        <span className={`transition-transform ${advancedOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Advanced Panel */}
      <div className={`w-full max-w-[390px] bg-card border border-primary border-t-0 rounded-b overflow-hidden transition-all ${
        advancedOpen ? 'max-h-[1100px] p-4 mb-3' : 'max-h-0 p-0'
      }`}>
        {/* Fortune */}
        <OptionTile checked={useFortune} onChange={setUseFortune} variant="fortune">
          {t.lblUseFortune}
        </OptionTile>

        {/* Opposed */}
        <OptionTile checked={isOpposed} onChange={setIsOpposed}>
          {t.lblOpposed}
        </OptionTile>

        <hr className="border-none border-t border-border my-3.5" />

        {/* Assist Section */}
        <div className="font-mono text-[0.65rem] text-primary uppercase font-black tracking-widest mb-2.5 flex items-center gap-1.5">
          🤝 {t.lblAssistTitle}
        </div>
        <p className="font-mono text-[0.67rem] text-muted leading-relaxed py-1 mb-2">
          {t.lblAssistHint}
        </p>

        <div className="bg-input-bg border border-accent rounded p-3 mb-2">
          <div className="font-mono text-[0.65rem] text-accent uppercase tracking-widest mb-2.5">
            {t.lblAssistHeader}
          </div>
          <div className="grid grid-cols-2 gap-2.5 mb-2">
            <NumberInput
              label={t.lblAssistAttr}
              value={assistAttr}
              onChange={setAssistAttr}
              min={1}
              max={15}
            />
            <NumberInput
              label={t.lblAssistSkill}
              value={assistSkill}
              onChange={setAssistSkill}
              min={0}
              max={10}
            />
          </div>
          <OptionTile checked={assistFocus} onChange={setAssistFocus} variant="assist">
            {t.lblAssistFocus}
          </OptionTile>
          <Button onClick={handleRollAssist} variant="assist" className="mt-1.5">
            {t.btnAssist}
          </Button>

          {/* Assist Result */}
          {assistResult && (
            <div className="font-mono text-sm mt-2 p-2 bg-card rounded border border-border">
              <div className="text-center mb-1.5">
                {assistResult.dice.map((die, i) => (
                  <D20Die key={i} die={die} index={i} />
                ))}
              </div>
              {assistResult.extraDice > 0 ? (
                <div className="text-accent text-[0.82rem]">
                  {t.assistSuccess} <strong>{assistResult.extraDice}</strong> → +{Math.min(3 - extraDice, assistResult.extraDice)} {t.assistDiceAdded}
                </div>
              ) : (
                <div className="text-muted text-[0.82rem]">{t.assistNone}</div>
              )}
              {assistResult.complications > 0 && (
                <div className="text-complication text-[0.78rem] mt-0.5">{t.assistComp}</div>
              )}
            </div>
          )}
        </div>

        <hr className="border-none border-t border-border my-3.5" />

        {/* Resource Trackers */}
        <ResourceTrackers />
      </div>

      {/* Results */}
      {result && <SkillTestResults key={rollKey} result={result} />}
    </div>
  );
}

function SkillTestResults({ result }: { result: SkillRollResult }) {
  const { t } = useApp();

  return (
    <div className="w-full max-w-[390px] relative z-[1]">
      {/* Dice Display */}
      <div className="font-mono text-[0.62rem] text-primary uppercase tracking-widest my-5 mb-2">
        {t.h3Dice}
      </div>
      <div className="text-center mb-1">
        {result.dice.map((die, i) => (
          <D20Die key={i} die={die} index={i} animate />
        ))}
      </div>

      {/* Summary Box */}
      <div className="bg-input-bg border border-border rounded p-4 my-3.5 grid grid-cols-3 gap-2 text-center">
        <div className="flex flex-col gap-1">
          <span className={`font-mono text-3xl font-black leading-none ${result.passed ? 'text-accent' : 'text-danger'}`}>
            {result.totalSuccesses}
          </span>
          <span className="font-mono text-[0.6rem] text-muted uppercase tracking-wider">{t.lblSuccesses}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-3xl font-black leading-none text-muted">
            {result.difficulty}
          </span>
          <span className="font-mono text-[0.6rem] text-muted uppercase tracking-wider">{t.lblRequired}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-3xl font-black leading-none text-primary">
            {result.passed && result.momentum > 0 ? `+${result.momentum}` : '—'}
          </span>
          <span className="font-mono text-[0.6rem] text-muted uppercase tracking-wider">{t.lblMom2}</span>
        </div>
      </div>

      {/* Result Tag */}
      <div className={`text-center p-3 rounded mb-2.5 font-display text-base font-black tracking-widest ${
        result.passed 
          ? 'bg-accent/15 border border-accent text-accent' 
          : 'bg-danger/12 border border-danger text-danger'
      }`}>
        {result.passed ? t.tagOk : t.tagKo}
      </div>

      {/* Complication Warning */}
      {result.complications > 0 && (
        <div className="bg-complication/12 border border-complication rounded p-2.5 mt-2 text-complication font-display text-[0.85rem] font-black tracking-widest text-center">
          {t.tagComp} ({result.complications} {result.complications === 1 ? t.lblComp1 : t.lblCompMulti})
          <div className="font-mono text-[0.72rem] opacity-85 mt-1 font-normal">
            {t.tagCompNote}
          </div>
        </div>
      )}

      {/* Breakdown */}
      <div className="font-mono text-[0.62rem] text-primary uppercase tracking-widest mt-5 mb-2">
        {t.h3Breakdown}
      </div>
      {result.dice.map((die, i) => {
        let rowClass = 'border-l-[3px] ';
        let badgeClass = '';
        let sucText = '';
        
        if (die.isComplication) {
          rowClass += 'border-l-complication';
          badgeClass = 'bg-complication text-white';
          sucText = die.successes > 0 ? `${die.successes} ✓+⚠` : '⚠';
        } else if (die.successes === 2) {
          rowClass += 'border-l-primary';
          badgeClass = 'bg-primary text-[#0a0900]';
          sucText = '2 ✓';
        } else if (die.successes === 1) {
          rowClass += 'border-l-accent';
          badgeClass = 'bg-accent text-[#05100a]';
          sucText = '1 ✓';
        } else {
          rowClass += 'border-l-border';
          badgeClass = 'bg-border text-muted';
          sucText = '0';
        }

        const prefix = die.isFortune ? `★ ${t.lblFortuneDie}` : die.isAssist ? `🤝 ${t.lblAssistDie}` : t.lblDie;
        
        return (
          <div key={i} className={`bg-input-bg border border-border rounded p-2.5 mb-1.5 flex justify-between items-center ${rowClass}`}>
            <span className="text-[0.82rem] font-display">
              {prefix} #{i + 1} — <strong>{die.value}</strong>
            </span>
            <span className={`font-mono text-[0.7rem] px-2 py-0.5 rounded font-black ${badgeClass}`}>
              {sucText}
            </span>
          </div>
        );
      })}

      {/* Momentum Generated */}
      {result.passed && result.momentum > 0 && (
        <div className="mt-2.5 bg-primary/[0.08] border border-primary rounded p-2.5 font-mono text-[0.78rem] text-primary">
          ⚡ {t.lblExtraMom} <strong>+{result.momentum}</strong>
        </div>
      )}
    </div>
  );
}
