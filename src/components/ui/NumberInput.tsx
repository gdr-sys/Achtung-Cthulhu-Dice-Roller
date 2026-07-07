interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'critical' | 'complication';
}

export function NumberInput({
  label,
  value,
  onChange,
  min = 0,
  max = 99,
  disabled = false,
  className = '',
  variant = 'default'
}: NumberInputProps) {
  const variantClasses = {
    default: 'border-border focus:border-primary',
    critical: 'border-primary text-primary',
    complication: 'border-complication text-complication'
  };

  return (
    <div className={className}>
      <label className="font-mono text-[0.65rem] text-muted uppercase font-extrabold tracking-wider block mb-1">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Math.max(min, Math.min(max, parseInt(e.target.value) || min)))}
        min={min}
        max={max}
        disabled={disabled}
        className={`w-full px-3 py-2.5 bg-input-bg border rounded text-text text-base font-mono outline-none transition-colors disabled:opacity-45 disabled:cursor-not-allowed ${variantClasses[variant]}`}
      />
    </div>
  );
}
