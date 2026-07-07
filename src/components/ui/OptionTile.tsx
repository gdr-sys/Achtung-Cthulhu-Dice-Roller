import { ReactNode } from 'react';

interface OptionTileProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  variant?: 'default' | 'fortune' | 'assist';
}

export function OptionTile({ 
  checked, 
  onChange, 
  children, 
  variant = 'default' 
}: OptionTileProps) {
  const activeClasses = {
    default: 'border-primary bg-primary/[0.08]',
    fortune: 'border-fortune bg-fortune/[0.08]',
    assist: 'border-accent bg-accent/[0.08]'
  };

  return (
    <label
      className={`flex items-center gap-2.5 bg-input-bg border p-2.5 rounded cursor-pointer text-[0.82rem] font-display transition-all mb-2 ${
        checked ? activeClasses[variant] : 'border-border hover:border-border/80'
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-primary cursor-pointer"
      />
      <span>{children}</span>
    </label>
  );
}
