import { useState } from 'react';
import { useApp } from '../context/AppContext';

interface QuickRefItem {
  title: string;
  content: string;
}

const titles: Record<string, string> = {
  en: '📖 Quick Reference',
  it: '📖 Riferimento Rapido',
  fr: '📖 Référence Rapide',
  de: '📖 Kurzreferenz',
  es: '📖 Referencia Rápida'
};

const quickRefData: Record<string, QuickRefItem[]> = {
  en: [
    { title: "Target Number (TN)", content: "Attribute + Skill + modifiers. Roll equal or under to succeed." },
    { title: "Critical Success", content: "Roll 1 (or ≤ Skill with Focus) = 2 successes!" },
    { title: "Complication", content: "Roll 20 (or higher with injuries) = GM gains a Complication." },
    { title: "Momentum", content: "Extra successes beyond difficulty. Spend for benefits or save (max 6)." },
    { title: "Fortune Points", content: "Powerful metacurrency. 1 die auto-succeeds, or reroll dice, add dice at no cost." },
    { title: "Combat Dice", content: "1=1dmg, 2=2dmg, 3-4=0, 5-6=1dmg+Effect. Soak reduces total." }
  ],
  it: [
    { title: "Numero Bersaglio (TN)", content: "Attributo + Skill + modificatori. Tira uguale o sotto per avere successo." },
    { title: "Successo Critico", content: "Tira 1 (o ≤ Skill con Focus) = 2 successi!" },
    { title: "Complicazione", content: "Tira 20 (o più alto con ferite) = Il GM ottiene una Complicazione." },
    { title: "Momentum", content: "Successi extra oltre la difficoltà. Spendi per vantaggi o conserva (max 6)." },
    { title: "Fortune Points", content: "Valuta potente. 1 dado auto-successo, rilancia dadi, aggiungi dadi gratis." },
    { title: "Challenge Dice", content: "1=1stress, 2=2stress, 3-4=0, 5-6=1stress+Effetto. L'armatura riduce il totale." }
  ],
  fr: [
    { title: "Nombre Cible (NC)", content: "Attribut + Compétence + modificateurs. Égal ou inférieur = succès." },
    { title: "Succès Critique", content: "Jet de 1 (ou ≤ Compétence avec Focus) = 2 succès !" },
    { title: "Complication", content: "Jet de 20 (ou plus avec blessures) = Le MJ gagne une Complication." },
    { title: "Élan", content: "Succès supplémentaires au-delà de la difficulté. Dépensez ou conservez (max 6)." },
    { title: "Points de Fortune", content: "Monnaie puissante. 1 dé auto-réussit, relancez, ajoutez des dés gratuitement." },
    { title: "Dés de Défi", content: "1=1stress, 2=2stress, 3-4=0, 5-6=1stress+Effet. L'armure réduit le total." }
  ],
  de: [
    { title: "Zielwert (ZW)", content: "Attribut + Fertigkeit + Modifikatoren. Gleich oder darunter = Erfolg." },
    { title: "Kritischer Erfolg", content: "Würfel 1 (oder ≤ Fertigkeit mit Fokus) = 2 Erfolge!" },
    { title: "Komplikation", content: "Würfel 20 (oder höher mit Verletzungen) = SL erhält Komplikation." },
    { title: "Schwung", content: "Extra-Erfolge über Schwierigkeit. Ausgeben oder sparen (max 6)." },
    { title: "Glückspunkte", content: "Mächtige Währung. 1 Würfel auto-Erfolg, neu würfeln, Würfel kostenlos hinzufügen." },
    { title: "Herausforderungswürfel", content: "1=1Stress, 2=2Stress, 3-4=0, 5-6=1Stress+Effekt. Rüstung reduziert." }
  ],
  es: [
    { title: "Número Objetivo (NO)", content: "Atributo + Habilidad + modificadores. Igual o menor = éxito." },
    { title: "Éxito Crítico", content: "Saca 1 (o ≤ Habilidad con Foco) = ¡2 éxitos!" },
    { title: "Complicación", content: "Saca 20 (o más con heridas) = El DJ obtiene una Complicación." },
    { title: "Ímpetu", content: "Éxitos extra sobre la dificultad. Gasta o guarda (máx 6)." },
    { title: "Puntos de Fortuna", content: "Moneda poderosa. 1 dado auto-éxito, relanzar, añadir dados gratis." },
    { title: "Dados Desafío", content: "1=1estrés, 2=2estrés, 3-4=0, 5-6=1estrés+Efecto. La armadura reduce." }
  ]
};

export function QuickReference() {
  const { language } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const items = quickRefData[language] || quickRefData.en;

  return (
    <div className="w-full max-w-[390px] mb-3 relative z-[1]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-card border border-border rounded p-3 cursor-pointer font-mono text-[0.72rem] font-extrabold text-fortune uppercase tracking-wider transition-all hover:border-fortune ${
          isOpen ? 'border-fortune rounded-b-none border-b-0' : ''
        }`}
      >
        <span>{titles[language] || titles.en}</span>
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      <div className={`bg-card border border-fortune border-t-0 rounded-b overflow-hidden transition-all ${
        isOpen ? 'max-h-[600px] p-4' : 'max-h-0 p-0'
      }`}>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="bg-input-bg border border-border rounded p-2.5">
              <div className="font-mono text-[0.7rem] text-fortune font-bold mb-1">
                {item.title}
              </div>
              <div className="font-display text-[0.75rem] text-text leading-relaxed">
                {item.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
