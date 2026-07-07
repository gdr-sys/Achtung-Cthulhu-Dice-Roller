export interface D20Result {
  value: number;
  successes: number;
  isCritical: boolean;
  isComplication: boolean;
  isFortune: boolean;
  isAssist: boolean;
}

export interface SkillRollResult {
  dice: D20Result[];
  totalSuccesses: number;
  difficulty: number;
  passed: boolean;
  momentum: number;
  complications: number;
}

export interface CombatDieResult {
  stress: number;
  hasEffect: boolean;
  face: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface DamageRollResult {
  dice: CombatDieResult[];
  totalStress: number;
  soak: number;
  netStress: number;
  effects: number;
}

export function rollD20(): number {
  return Math.floor(Math.random() * 20) + 1;
}

export function rollCombatDie(): CombatDieResult {
  const face = (Math.floor(Math.random() * 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6;
  
  switch (face) {
    case 1:
      return { stress: 1, hasEffect: false, face };
    case 2:
      return { stress: 2, hasEffect: false, face };
    case 3:
    case 4:
      return { stress: 0, hasEffect: false, face };
    case 5:
    case 6:
      return { stress: 1, hasEffect: true, face };
    default:
      return { stress: 0, hasEffect: false, face: 3 };
  }
}

export function computeSuccesses(
  roll: number,
  targetNumber: number,
  criticalMax: number
): { successes: number; isCritical: boolean } {
  if (roll <= criticalMax) {
    return { successes: 2, isCritical: true };
  }
  if (roll <= targetNumber) {
    return { successes: 1, isCritical: false };
  }
  return { successes: 0, isCritical: false };
}

export function rollSkillTest(params: {
  attribute: number;
  skill: number;
  tnBonus: number;
  difficulty: number;
  extraDice: number;
  hasFocus: boolean;
  useFortune: boolean;
  complicationRange: number;
  criticalMax: number;
  assistDice?: number;
}): SkillRollResult {
  const {
    attribute,
    skill,
    tnBonus,
    difficulty,
    extraDice,
    useFortune,
    complicationRange,
    criticalMax,
    assistDice = 0
  } = params;

  const targetNumber = Math.max(1, attribute + skill + tnBonus);
  const baseDice = 2;
  const totalDice = baseDice + Math.min(3, extraDice + assistDice);
  
  const dice: D20Result[] = [];
  
  for (let i = 0; i < totalDice; i++) {
    const value = rollD20();
    const { successes, isCritical } = computeSuccesses(value, targetNumber, criticalMax);
    const isComplication = value >= complicationRange;
    const isFortune = useFortune && i === 0;
    const isAssist = i >= baseDice + extraDice;
    
    let finalSuccesses = successes;
    if (isFortune && finalSuccesses < 1) {
      finalSuccesses = 1;
    }
    
    dice.push({
      value,
      successes: finalSuccesses,
      isCritical,
      isComplication,
      isFortune,
      isAssist
    });
  }
  
  const totalSuccesses = dice.reduce((sum, d) => sum + d.successes, 0);
  const complications = dice.filter(d => d.isComplication).length;
  const passed = totalSuccesses >= difficulty;
  const momentum = passed ? Math.max(0, totalSuccesses - difficulty) : 0;
  
  return {
    dice,
    totalSuccesses,
    difficulty,
    passed,
    momentum,
    complications
  };
}

export function rollAssist(params: {
  attribute: number;
  skill: number;
  hasFocus: boolean;
  complicationRange: number;
}): { successes: number; dice: D20Result[]; extraDice: number; complications: number } {
  const { attribute, skill, hasFocus, complicationRange } = params;
  const targetNumber = attribute + skill;
  const criticalMax = hasFocus ? Math.max(1, skill) : 1;
  
  const dice: D20Result[] = [];
  
  for (let i = 0; i < 2; i++) {
    const value = rollD20();
    const { successes, isCritical } = computeSuccesses(value, targetNumber, criticalMax);
    const isComplication = value >= complicationRange;
    
    dice.push({
      value,
      successes,
      isCritical,
      isComplication,
      isFortune: false,
      isAssist: true
    });
  }
  
  const totalSuccesses = dice.reduce((sum, d) => sum + d.successes, 0);
  const complications = dice.filter(d => d.isComplication).length;
  // Assist always tests against difficulty 1
  const extraDice = Math.max(0, totalSuccesses - 1);
  
  return { successes: totalSuccesses, dice, extraDice, complications };
}

export function rollDamage(numDice: number, soak: number): DamageRollResult {
  const dice: CombatDieResult[] = [];
  
  for (let i = 0; i < numDice; i++) {
    dice.push(rollCombatDie());
  }
  
  const totalStress = dice.reduce((sum, d) => sum + d.stress, 0);
  const effects = dice.filter(d => d.hasEffect).length;
  const netStress = Math.max(0, totalStress - soak);
  
  return {
    dice,
    totalStress,
    soak,
    netStress,
    effects
  };
}
