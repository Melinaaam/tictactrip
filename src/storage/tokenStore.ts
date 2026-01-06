/*
  Rôle : Gestion des tokens et des quotas de consommation de mots
  Responsabilités :
    - Stocker les tokens générés
    - Suivre la consommation de mots par token
    - Réinitialiser automatiquement les quotas chaque jour
*/

type TokenUsage = {
  dayKey: string;
  usedWords: number;
};

const usageByToken = new Map<string, TokenUsage>();

function getDayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function has(token: string): boolean {
  return usageByToken.has(token);
}

export function add(token: string): void {
  usageByToken.set(token, {
    dayKey: getDayKey(),
    usedWords: 0,
  });
}

export function consumeWords(
  token: string,
  wordsToAdd: number,
  dailyLimit: number,
  date = new Date()
): boolean {
  const dayKey = getDayKey(date);
  const current = usageByToken.get(token);

  if (!current || current.dayKey !== dayKey) {
    usageByToken.set(token, { dayKey, usedWords: 0 });
  }

  const updated = usageByToken.get(token)!;
  const nextValue = updated.usedWords + wordsToAdd;

  if (nextValue > dailyLimit) return false;

  updated.usedWords = nextValue;
  return true;
}

export function getUsedWords(token: string, date = new Date()): number {
  const dayKey = getDayKey(date);
  const current = usageByToken.get(token);
  if (!current || current.dayKey !== dayKey) return 0;
  return current.usedWords;
}

export function resetAll(): void {
  usageByToken.clear();
}
