import { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from './ui/Card';
import { NumberInput } from './ui/NumberInput';
import { Button } from './ui/Button';
import { CombatDie } from './dice/CombatDie';
import { rollDamage, DamageRollResult } from '../utils/diceRoller';

interface DamagePanelProps {
  onRoll?: (result: DamageRollResult) => void;
}

export function DamagePanel({ onRoll }: DamagePanelProps) {
  const { t } = useApp();
  
  const [numDice, setNumDice] = useState(2);
  const [soak, setSoak] = useState(0);
  const [result, setResult] = useState<DamageRollResult | null>(null);

  const handleRoll = useCallback(() => {
    const rollResult = rollDamage(numDice, soak);
    setResult(rollResult);
    onRoll?.(rollResult);
  }, [numDice, soak, onRoll]);

  return (
    <div className="w-full max-w-[390px]">
      <Card title={t.cardDmg} icon="💥">
        {/* Dice Count & Soak */}
        <div className="grid grid-cols-2 gap-2.5 mb-3.5">
          <NumberInput
            label={t.lblNumCD}
            value={numDice}
            onChange={setNumDice}
            min={1}
            max={10}
          />
          <NumberInput
            label={t.lblCover}
            value={soak}
            onChange={setSoak}
            min={0}
            max={10}
          />
        </div>

        {/* Combat Die Legend */}
        <div className="font-mono text-[0.65rem] text-primary uppercase font-black tracking-widest mb-2 flex items-center gap-1.5">
          📋 {t.lblCdLegend}
        </div>
        <div className="grid grid-cols-2 gap-1.5 mb-3.5">
          <div className="bg-input-bg border border-accent rounded p-2 font-mono text-[0.7rem] flex items-center gap-2">
            <span className="text-base font-black min-w-4 text-accent">1</span>
            <span>{t.cdF1}</span>
          </div>
          <div className="bg-input-bg border border-primary rounded p-2 font-mono text-[0.7rem] flex items-center gap-2">
            <span className="text-base font-black min-w-4 text-primary">2</span>
            <span>{t.cdF2}</span>
          </div>
          <div className="bg-input-bg border border-border rounded p-2 font-mono text-[0.7rem] flex items-center gap-2 opacity-50">
            <span className="text-base font-black min-w-4 text-muted">—</span>
            <span>{t.cdF3}</span>
          </div>
          <div className="bg-input-bg border border-border rounded p-2 font-mono text-[0.7rem] flex items-center gap-2 opacity-50">
            <span className="text-base font-black min-w-4 text-muted">—</span>
            <span>{t.cdF4}</span>
          </div>
          <div className="bg-input-bg border border-complication rounded p-2 font-mono text-[0.7rem] flex items-center gap-2 col-span-2">
            <span className="text-base font-black min-w-4 text-complication">☢</span>
            <span>{t.cdF5}</span>
          </div>
        </div>

        {/* Roll Button */}
        <Button onClick={handleRoll} variant="danger">
          {t.btnDmg}
        </Button>
      </Card>

      {/* Results */}
      {result && <DamageResults result={result} />}
    </div>
  );
}

function DamageResults({ result }: { result: DamageRollResult }) {
  const { t } = useApp();

  return (
    <div className="w-full max-w-[390px] relative z-[1]">
      {/* Dice Display */}
      <div className="font-mono text-[0.62rem] text-primary uppercase tracking-widest my-5 mb-2">
        {t.h3CDice}
      </div>
      <div className="text-center mb-1">
        {result.dice.map((die, i) => (
          <CombatDie key={i} die={die} />
        ))}
      </div>

      {/* Summary Box */}
      <div className="bg-input-bg border border-border rounded p-3.5 my-3.5 grid grid-cols-2 gap-2 text-center">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-3xl font-black leading-none text-accent">
            {result.totalStress}
          </span>
          <span className="font-mono text-[0.6rem] text-muted uppercase tracking-wider">{t.lblTotalStress}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-3xl font-black leading-none text-muted">
            {result.soak}
          </span>
          <span className="font-mono text-[0.6rem] text-muted uppercase tracking-wider">{t.lblCovers}</span>
        </div>
        <div className="flex flex-col gap-1 col-span-2">
          <span className={`font-mono text-4xl font-black leading-none ${result.netStress > 0 ? 'text-danger' : 'text-accent'}`}>
            {result.netStress}
          </span>
          <span className="font-mono text-[0.6rem] text-muted uppercase tracking-wider">{t.lblNetStress}</span>
        </div>
      </div>

      {/* Breakdown */}
      {result.dice.map((die, i) => {
        let rowClass = 'border-l-[3px] ';
        let badgeClass = '';
        let label = '';
        
        if (die.stress === 0) {
          rowClass += 'border-l-border';
          badgeClass = 'bg-border text-muted';
          label = t.cdBlank;
        } else if (die.hasEffect) {
          rowClass += 'border-l-complication';
          badgeClass = 'bg-complication text-white';
          label = t.cdEffect;
        } else if (die.stress === 2) {
          rowClass += 'border-l-primary';
          badgeClass = 'bg-primary text-[#0a0900]';
          label = t.cdStress2;
        } else {
          rowClass += 'border-l-accent';
          badgeClass = 'bg-accent text-[#05100a]';
          label = t.cdStress1;
        }

        return (
          <div key={i} className={`bg-input-bg border border-border rounded p-2.5 mb-1.5 flex justify-between items-center ${rowClass}`}>
            <span className="text-[0.82rem] font-display">
              Die #{i + 1}
            </span>
            <span className={`font-mono text-[0.7rem] px-2 py-0.5 rounded font-black ${badgeClass}`}>
              {label}
            </span>
          </div>
        );
      })}

      {/* Effects */}
      {result.effects > 0 && (
        <div className="mt-1.5">
          {Array.from({ length: result.effects }).map((_, i) => (
            <div key={i} className="bg-complication/[0.08] border border-complication rounded p-2.5 mb-1.5 font-mono text-[0.78rem] text-complication">
              {t.effectLabel}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
