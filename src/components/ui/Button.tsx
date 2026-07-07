import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'danger' | 'assist';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  disabled = false,
  loading = false
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-primary text-[#0f0e0a]',
    danger: 'bg-danger text-white',
    assist: 'bg-accent text-[#0a120a]'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full py-4 border-none rounded font-display font-extrabold text-lg uppercase tracking-widest cursor-pointer transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${className} ${loading ? 'animate-pulse' : ''}`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Rolling...
        </span>
      ) : children}
    </button>
  );
}
