import { useState, useCallback } from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { TitleBanner } from './components/TitleBanner';
import { TabBar } from './components/TabBar';
import { SkillTestPanel } from './components/SkillTestPanel';
import { DamagePanel } from './components/DamagePanel';
import { QuickReference } from './components/QuickReference';
import { RollHistory, HistoryEntry } from './components/RollHistory';
import { Footer } from './components/Footer';
import { SkillRollResult, DamageRollResult } from './utils/diceRoller';

function AppContent() {
  const [activeTab, setActiveTab] = useState<'skill' | 'damage'>('skill');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [nextId, setNextId] = useState(1);

  const addToHistory = useCallback((type: 'skill' | 'damage', result: SkillRollResult | DamageRollResult) => {
    setHistory(prev => [...prev.slice(-19), { // Keep last 20 entries
      id: nextId,
      timestamp: new Date(),
      type,
      result
    }]);
    setNextId(prev => prev + 1);
  }, [nextId]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return (
    <div className="flex flex-col items-center p-4 min-h-screen">
      <Header />
      <TitleBanner />
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === 'skill' ? (
        <SkillTestPanel onRoll={(result) => addToHistory('skill', result)} />
      ) : (
        <DamagePanel onRoll={(result) => addToHistory('damage', result)} />
      )}
      
      <RollHistory history={history} onClear={clearHistory} />
      <QuickReference />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
