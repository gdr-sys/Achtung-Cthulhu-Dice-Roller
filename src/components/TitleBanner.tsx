import { useApp } from '../context/AppContext';

export function TitleBanner() {
  const { t } = useApp();

  return (
    <div className="w-full max-w-[390px] text-center mb-3.5 relative z-[1]">
      <div className="font-mono text-[0.65rem] text-muted tracking-widest mb-0.5">
        {t.subtitle}
      </div>
      <h1 className="font-display text-xl text-primary m-0 uppercase tracking-[3px] drop-shadow-[0_0_20px_rgba(200,168,75,0.3)]">
        Achtung! Cthulhu
      </h1>
      <hr className="border-none border-t border-border mt-2 mx-auto w-3/5" />
    </div>
  );
}
