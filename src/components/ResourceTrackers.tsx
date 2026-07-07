import { useApp } from '../context/AppContext';

export function ResourceTrackers() {
  const { t, resources, updateResource } = useApp();

  return (
    <div>
      <div className="font-mono text-[0.65rem] text-primary uppercase font-black tracking-widest mb-2.5 flex items-center gap-1.5">
        📊 {t.lblTrackers}
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-3">
        {/* Momentum */}
        <div className="bg-input-bg border border-border rounded p-2.5 text-center">
          <div className="font-mono text-2xl font-black leading-none text-primary">
            {resources.momentum}
          </div>
          <div className="font-mono text-[0.58rem] text-muted uppercase tracking-wider mt-1">
            {t.lblMom}
          </div>
          <div className="flex gap-1 mt-1.5 justify-center">
            <button
              onClick={() => updateResource('momentum', -1)}
              className="bg-transparent border border-border text-text rounded font-mono text-xs px-2 py-0.5 cursor-pointer font-black transition-colors hover:border-primary hover:text-primary"
            >
              −
            </button>
            <button
              onClick={() => updateResource('momentum', 1)}
              className="bg-transparent border border-border text-text rounded font-mono text-xs px-2 py-0.5 cursor-pointer font-black transition-colors hover:border-primary hover:text-primary"
            >
              +
            </button>
          </div>
        </div>

        {/* Threat */}
        <div className="bg-input-bg border border-border rounded p-2.5 text-center">
          <div className="font-mono text-2xl font-black leading-none text-threat">
            {resources.threat}
          </div>
          <div className="font-mono text-[0.58rem] text-muted uppercase tracking-wider mt-1">
            {t.lblThreat}
          </div>
          <div className="flex gap-1 mt-1.5 justify-center">
            <button
              onClick={() => updateResource('threat', -1)}
              className="bg-transparent border border-border text-text rounded font-mono text-xs px-2 py-0.5 cursor-pointer font-black transition-colors hover:border-threat hover:text-threat"
            >
              −
            </button>
            <button
              onClick={() => updateResource('threat', 1)}
              className="bg-transparent border border-border text-text rounded font-mono text-xs px-2 py-0.5 cursor-pointer font-black transition-colors hover:border-threat hover:text-threat"
            >
              +
            </button>
          </div>
        </div>

        {/* Fortune */}
        <div className="bg-input-bg border border-border rounded p-2.5 text-center">
          <div className="font-mono text-2xl font-black leading-none text-fortune">
            {resources.fortune}
          </div>
          <div className="font-mono text-[0.58rem] text-muted uppercase tracking-wider mt-1">
            {t.lblFortune}
          </div>
          <div className="flex gap-1 mt-1.5 justify-center">
            <button
              onClick={() => updateResource('fortune', -1)}
              className="bg-transparent border border-border text-text rounded font-mono text-xs px-2 py-0.5 cursor-pointer font-black transition-colors hover:border-fortune hover:text-fortune"
            >
              −
            </button>
            <button
              onClick={() => updateResource('fortune', 1)}
              className="bg-transparent border border-border text-text rounded font-mono text-xs px-2 py-0.5 cursor-pointer font-black transition-colors hover:border-fortune hover:text-fortune"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <p className="font-mono text-[0.67rem] text-muted leading-relaxed">
        {t.lblTrackerHint}
      </p>
    </div>
  );
}
