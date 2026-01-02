// Sans code détaillé, pense-le comme ça :

// create(email) → crée un token

// has(token) → vérifie si le token existe

// getUsage(token, date) → combien de mots consommés aujourd’hui

// incrementUsage(token, date, count) → ajoute des mots

// Ton middleware ne sait rien de comment c’est stocké.
// Il demande juste : “ce token est valide ?”.

// 👉 Séparation des responsabilités = très bon point en review.

// src/storage/tokenStore.ts

// src/storage/tokenStore.ts

type TokenUsage = {
  dayKey: string;
  usedWords: number;
};

const usageByToken = new Map<string, TokenUsage>();

function getDayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

// Vérifie si un token existe (pour tokenAuth)
export function has(token: string): boolean {
  return usageByToken.has(token);
}

// Ajoute un token (appelé par /api/token)
export function add(token: string): void {
  usageByToken.set(token, {
    dayKey: getDayKey(),
    usedWords: 0,
  });
}

// Consomme des mots pour un token donné
// Retourne false si le quota est dépassé
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

// Utilisé uniquement dans les tests
export function getUsedWords(token: string, date = new Date()): number {
  const dayKey = getDayKey(date);
  const current = usageByToken.get(token);
  if (!current || current.dayKey !== dayKey) return 0;
  return current.usedWords;
}

export function resetAll(): void {
  usageByToken.clear();
}
