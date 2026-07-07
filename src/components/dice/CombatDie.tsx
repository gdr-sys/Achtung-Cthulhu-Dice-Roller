import { CombatDieResult } from '../../utils/diceRoller';

interface CombatDieProps {
  die: CombatDieResult;
}

export function CombatDie({ die }: CombatDieProps) {
  let baseClasses = 'inline-flex w-13 h-13 items-center justify-center flex-col bg-input-bg border-2 rounded-md m-1 font-mono font-bold relative text-text select-none';
  
  if (die.stress === 0) {
    baseClasses += ' border-border opacity-45';
  } else if (die.hasEffect) {
    baseClasses += ' border-complication bg-complication/10';
  } else if (die.stress === 2) {
    baseClasses += ' border-primary bg-primary/10';
  } else {
    baseClasses += ' border-accent bg-accent/10';
  }

  return (
    <div className={baseClasses}>
      <span className={`text-lg leading-none ${
        die.stress === 0 ? 'text-muted' : 
        die.hasEffect ? 'text-complication' : 
        die.stress === 2 ? 'text-primary' : 'text-accent'
      }`}>
        {die.stress === 0 ? '—' : die.stress}
      </span>
      {die.hasEffect && (
        <span className="text-xs text-complication">☢</span>
      )}
    </div>
  );
}
