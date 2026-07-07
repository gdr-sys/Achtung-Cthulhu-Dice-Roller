import { useApp } from '../context/AppContext';

interface TabBarProps {
  activeTab: 'skill' | 'damage';
  onTabChange: (tab: 'skill' | 'damage') => void;
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const { t } = useApp();

  return (
    <div className="w-full max-w-[390px] grid grid-cols-2 gap-1.5 mb-3 relative z-[1]">
      <button
        onClick={() => onTabChange('skill')}
        className={`px-1.5 py-2.5 border rounded cursor-pointer font-mono text-[0.72rem] uppercase tracking-wider transition-all ${
          activeTab === 'skill'
            ? 'border-primary text-primary bg-primary/[0.08]'
            : 'border-border text-muted bg-card hover:border-primary/50'
        }`}
      >
        🎯 {t.tabSkill}
      </button>
      <button
        onClick={() => onTabChange('damage')}
        className={`px-1.5 py-2.5 border rounded cursor-pointer font-mono text-[0.72rem] uppercase tracking-wider transition-all ${
          activeTab === 'damage'
            ? 'border-primary text-primary bg-primary/[0.08]'
            : 'border-border text-muted bg-card hover:border-primary/50'
        }`}
      >
        💥 {t.tabDmg}
      </button>
    </div>
  );
}
