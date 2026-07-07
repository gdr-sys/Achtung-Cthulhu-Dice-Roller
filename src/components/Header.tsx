import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Language, translations } from '../i18n/translations';

export function Header() {
  const { theme, toggleTheme, language, setLanguage, t } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages: Language[] = ['it', 'en', 'fr', 'de', 'es'];

  return (
    <div className="w-full max-w-[390px] flex justify-between items-center mb-3 relative z-10">
      {/* Language Selector */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="bg-card border-2 border-border text-text px-2.5 py-1.5 rounded-lg cursor-pointer font-bold text-sm flex items-center gap-1.5 font-mono hover:border-primary transition-colors"
        >
          <span>{t.flag}</span>
          <span>{t.code}</span>
          <span className="text-xs">▾</span>
        </button>
        
        {dropdownOpen && (
          <div className="absolute top-full left-0 mt-1.5 bg-card border-2 border-border rounded-lg overflow-hidden z-50 min-w-[150px] shadow-xl">
            {languages.map(lang => (
              <button
                key={lang}
                onClick={() => {
                  setLanguage(lang);
                  setDropdownOpen(false);
                }}
                className={`w-full px-3 py-2 cursor-pointer text-sm font-semibold flex items-center gap-2 font-mono hover:bg-input-bg text-left transition-colors ${
                  language === lang ? 'text-primary' : 'text-text'
                }`}
              >
                {translations[lang].flag} {translations[lang].code} — {translations[lang].name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="bg-card border-2 border-border text-text px-2.5 py-1.5 rounded-lg cursor-pointer text-xs font-mono font-bold hover:border-primary transition-colors"
      >
        {t.themeBtn} {theme === 'dark' ? '🌓' : '☀️'}
      </button>
    </div>
  );
}
