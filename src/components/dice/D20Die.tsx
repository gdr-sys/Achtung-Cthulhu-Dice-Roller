import { useApp } from '../../context/AppContext';
import { D20Result } from '../../utils/diceRoller';

interface D20DieProps {
  die: D20Result;
  index: number;
  animate?: boolean;
}

export function D20Die({ die, index, animate = false }: D20DieProps) {
  const { t } = useApp();

  let baseClasses = 'inline-flex w-12 h-12 items-center justify-center bg-input-bg border-2 rounded m-1 font-mono font-bold text-xl relative text-text transition-all select-none';
  
  if (animate) {
    baseClasses += ' animate-dice-roll';
  }
  
  if (die.isComplication) {
    baseClasses += ' border-complication bg-complication/15 text-complication shadow-[0_0_12px_rgba(230,126,34,0.5)]';
    if (animate) baseClasses += ' animate-pulse-comp';
  } else if (die.isCritical || die.successes === 2) {
    baseClasses += ' border-primary bg-primary/15 text-primary shadow-[0_0_10px_rgba(200,168,75,0.3)]';
  } else if (die.successes === 1) {
    baseClasses += ' border-accent bg-accent/12 text-accent';
  } else {
    baseClasses += ' border-border';
  }

  if (die.isFortune && !die.isComplication) {
    baseClasses += ' border-fortune bg-fortune/10';
  }
  if (die.isAssist && !die.isComplication && !die.isFortune) {
    baseClasses += ' border-accent bg-accent/[0.08] opacity-80';
  }

  return (
    <div 
      className={baseClasses}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {die.value}
      
      {/* Status Badge */}
      {die.isComplication ? (
        <span className="absolute -bottom-1.5 -right-1.5 text-[0.5rem] px-1 py-0.5 rounded bg-complication text-white font-black font-mono">
          {t.dCompLabel}
        </span>
      ) : die.successes === 2 ? (
        <span className="absolute -bottom-1.5 -right-1.5 text-[0.5rem] px-1 py-0.5 rounded bg-primary text-[#0a0a05] font-black font-mono">
          {t.dSucLabel}
        </span>
      ) : die.successes === 0 ? (
        <span className="absolute -bottom-1.5 -right-1.5 text-[0.5rem] px-1 py-0.5 rounded bg-border text-muted font-black font-mono">
          {t.dFailLabel}
        </span>
      ) : null}
      
      {/* Fortune Badge */}
      {die.isFortune && !die.isComplication && (
        <span className="absolute -top-1.5 -left-1.5 text-[0.5rem] px-1 py-0.5 rounded bg-fortune text-[#05080f] font-black font-mono">
          ★
        </span>
      )}
      
      {/* Assist Badge */}
      {die.isAssist && !die.isComplication && !die.isFortune && (
        <span className="absolute -top-1.5 -left-1.5 text-[0.5rem] px-1 py-0.5 rounded bg-accent text-[#05100a] font-black font-mono">
          {t.lblAssistDie}
        </span>
      )}
    </div>
  );
}
