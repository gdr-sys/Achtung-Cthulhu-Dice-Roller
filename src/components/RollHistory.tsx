import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SkillRollResult, DamageRollResult } from '../utils/diceRoller';

export type HistoryEntry = {
  id: number;
  timestamp: Date;
  type: 'skill' | 'damage';
  result: SkillRollResult | DamageRollResult;
};

interface RollHistoryProps {
  history: HistoryEntry[];
  onClear: () => void;
}

export function RollHistory({ history, onClear }: RollHistoryProps) {
  const { language } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  if (history.length === 0) return null;

  const labels = {
    en: { title: 'Roll History', clear: 'Clear', skill: 'Skill', damage: 'Damage', success: '✓', fail: '✗', momentum: 'Mom', stress: 'Stress' },
    it: { title: 'Storico Tiri', clear: 'Pulisci', skill: 'Skill', damage: 'Danno', success: '✓', fail: '✗', momentum: 'Mom', stress: 'Stress' },
    fr: { title: 'Historique', clear: 'Effacer', skill: 'Comp.', damage: 'Dégâts', success: '✓', fail: '✗', momentum: 'Élan', stress: 'Stress' },
    de: { title: 'Würfelverlauf', clear: 'Löschen', skill: 'Fert.', damage: 'Schaden', success: '✓', fail: '✗', momentum: 'Schw.', stress: 'Stress' },
    es: { title: 'Historial', clear: 'Limpiar', skill: 'Hab.', damage: 'Daño', success: '✓', fail: '✗', momentum: 'Ímp.', stress: 'Estrés' }
  };

  const l = labels[language] || labels.en;

  return (
    <div className="w-full max-w-[390px] mb-3 relative z-[1]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-card border border-border rounded p-3 cursor-pointer font-mono text-[0.72rem] font-extrabold text-muted uppercase tracking-wider transition-all hover:border-primary ${
          isOpen ? 'border-primary rounded-b-none border-b-0' : ''
        }`}
      >
        <span>📜 {l.title} ({history.length})</span>
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      <div className={`bg-card border border-primary border-t-0 rounded-b overflow-hidden transition-all ${
        isOpen ? 'max-h-[400px] overflow-y-auto' : 'max-h-0'
      }`}>
        <div className="p-3 space-y-2">
          {history.slice().reverse().map((entry) => {
            const time = entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            if (entry.type === 'skill') {
              const r = entry.result as SkillRollResult;
              return (
                <div key={entry.id} className="bg-input-bg border border-border rounded p-2 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-muted font-mono">{time}</span>
                    <span className="text-primary font-mono uppercase">{l.skill}</span>
                    <span className="font-mono">
                      [{r.dice.map(d => d.value).join(', ')}]
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${r.passed ? 'text-accent' : 'text-danger'}`}>
                      {r.passed ? l.success : l.fail} {r.totalSuccesses}/{r.difficulty}
                    </span>
                    {r.passed && r.momentum > 0 && (
                      <span className="text-primary">+{r.momentum} {l.momentum}</span>
                    )}
                    {r.complications > 0 && (
                      <span className="text-complication">⚠{r.complications}</span>
                    )}
                  </div>
                </div>
              );
            } else {
              const r = entry.result as DamageRollResult;
              return (
                <div key={entry.id} className="bg-input-bg border border-border rounded p-2 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-muted font-mono">{time}</span>
                    <span className="text-danger font-mono uppercase">{l.damage}</span>
                    <span className="font-mono">
                      [{r.dice.map(d => d.stress === 0 ? '—' : d.hasEffect ? `${d.stress}☢` : d.stress).join(', ')}]
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-danger font-bold">
                      {r.netStress} {l.stress}
                    </span>
                    {r.effects > 0 && (
                      <span className="text-complication">⚡×{r.effects}</span>
                    )}
                  </div>
                </div>
              );
            }
          })}
        </div>
        
        <div className="p-3 pt-0">
          <button
            onClick={onClear}
            className="w-full py-2 bg-input-bg border border-border rounded font-mono text-xs text-muted hover:text-danger hover:border-danger transition-colors"
          >
            🗑️ {l.clear}
          </button>
        </div>
      </div>
    </div>
  );
}
