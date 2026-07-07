import { useApp } from '../context/AppContext';

export function Footer() {
  const { t } = useApp();

  return (
    <footer className="text-center py-10 px-2.5 font-mono text-[0.78em] text-footer w-full relative z-[1]">
      <p>
        {t.footer}{' '}
        <a 
          href="mailto:noemi.marcolini@gmail.com" 
          className="text-inherit no-underline border-b border-current hover:text-primary transition-colors"
        >
          Noemi Marcolini
        </a>
      </p>
      <a
        href="https://ko-fi.com/noemimarcolini"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 mt-2 text-footer no-underline text-[0.75em] border-b border-current hover:text-primary transition-colors"
      >
        {t.kofi}
      </a>
    </footer>
  );
}
