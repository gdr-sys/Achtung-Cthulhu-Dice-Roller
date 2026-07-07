import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  icon?: string;
  className?: string;
}

export function Card({ children, title, icon, className = '' }: CardProps) {
  return (
    <div className={`bg-card p-4 rounded border border-border shadow-lg relative z-[1] mb-3 ${className}`}>
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent rounded-t" />
      {title && (
        <div className="font-mono text-[0.65rem] text-primary uppercase font-black tracking-widest mb-3.5 flex items-center gap-1.5">
          {icon && <span>{icon}</span>}
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
