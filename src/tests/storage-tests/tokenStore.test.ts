import * as tokenStore from '../../storage/tokenStore';

describe('tokenStore', () => {
  beforeEach(() => {
    // Réinitialiser le tokenStore avant chaque test
    jest.resetModules();
  });

  it('should add and recognize a token', () => {
    const token = 'testToken';
    expect(tokenStore.has(token)).toBe(false);
    tokenStore.add(token);
    expect(tokenStore.has(token)).toBe(true);
  });

  it('should consume words and enforce daily limit', () => {
    const token = 'limitToken';
    const dailyLimit = 1000;
    tokenStore.add(token);

    // Consommer 500 mots
    expect(tokenStore.consumeWords(token, 500, dailyLimit)).toBe(true);
    expect(tokenStore.getUsedWords(token)).toBe(500);

    // Consommer 400 mots
    expect(tokenStore.consumeWords(token, 400, dailyLimit)).toBe(true);
    expect(tokenStore.getUsedWords(token)).toBe(900);

    // Essayer de consommer 200 mots (dépassement du quota)
    expect(tokenStore.consumeWords(token, 200, dailyLimit)).toBe(false);
    expect(tokenStore.getUsedWords(token)).toBe(900);

    // Consommer 100 mots (atteint le quota)
    expect(tokenStore.consumeWords(token, 100, dailyLimit)).toBe(true);
    expect(tokenStore.getUsedWords(token)).toBe(1000);
  });

  it('should reset usage on a new day', () => {
    const token = 'dailyResetToken';
    const dailyLimit = 1000;
    tokenStore.add(token);

    // Consommer 800 mots aujourd'hui
    expect(tokenStore.consumeWords(token, 800, dailyLimit)).toBe(true);
    expect(tokenStore.getUsedWords(token)).toBe(800);

    // Simuler le passage au jour suivant
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Consommer 500 mots demain (doit être autorisé car le compteur est réinitialisé)
    expect(tokenStore.consumeWords(token, 500, dailyLimit, tomorrow)).toBe(true);
    expect(tokenStore.getUsedWords(token, tomorrow)).toBe(500);
  });
});

  it('should return 0 used words for unknown token or new day', () => {
    const token = 'unknownToken';
    expect(tokenStore.getUsedWords(token)).toBe(0);

    tokenStore.add(token);
    expect(tokenStore.getUsedWords(token)).toBe(0);

    tokenStore.consumeWords(token, 300, 1000);
    expect(tokenStore.getUsedWords(token)).toBe(300);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(tokenStore.getUsedWords(token, tomorrow)).toBe(0);
  });