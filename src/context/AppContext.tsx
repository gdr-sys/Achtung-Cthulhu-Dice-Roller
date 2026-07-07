import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, Translation, translations } from '../i18n/translations';

interface Resources {
  momentum: number;
  threat: number;
  fortune: number;
}

interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translation;
  resources: Resources;
  updateResource: (type: keyof Resources, delta: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('ac-theme');
    return (saved as 'dark' | 'light') || 'dark';
  });
  
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('ac-lang');
    return (saved as Language) || 'en';
  });
  
  const [resources, setResources] = useState<Resources>(() => {
    const saved = localStorage.getItem('ac-resources');
    return saved ? JSON.parse(saved) : { momentum: 0, threat: 0, fortune: 3 };
  });

  useEffect(() => {
    localStorage.setItem('ac-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('ac-lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('ac-resources', JSON.stringify(resources));
  }, [resources]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const setLanguage = (lang: Language) => setLanguageState(lang);

  const updateResource = (type: keyof Resources, delta: number) => {
    setResources(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta)
    }));
  };

  const t = translations[language];

  return (
    <AppContext.Provider value={{ 
      theme, 
      toggleTheme, 
      language, 
      setLanguage, 
      t, 
      resources, 
      updateResource 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
