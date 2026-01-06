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

  it('should return false for has() on non-existent token', () => {
    expect(tokenStore.has('nonExistentToken')).toBe(false);
  });

  it('should handle consuming 0 words', () => {
    const token = 'zeroWordsToken';
    tokenStore.add(token);
    
    expect(tokenStore.consumeWords(token, 0, 1000)).toBe(true);
    expect(tokenStore.getUsedWords(token)).toBe(0);
  });

  it('should isolate quotas for different tokens', () => {
    const token1 = 'user1Token';
    const token2 = 'user2Token';
    const limit = 1000;

    tokenStore.add(token1);
    tokenStore.add(token2);

    // Token1 consomme 800 mots
    tokenStore.consumeWords(token1, 800, limit);
    expect(tokenStore.getUsedWords(token1)).toBe(800);
    expect(tokenStore.getUsedWords(token2)).toBe(0);

    // Token2 consomme 700 mots
    tokenStore.consumeWords(token2, 700, limit);
    expect(tokenStore.getUsedWords(token1)).toBe(800);
    expect(tokenStore.getUsedWords(token2)).toBe(700);

    // Token1 peut encore consommer jusqu'à 200
    expect(tokenStore.consumeWords(token1, 200, limit)).toBe(true);
    expect(tokenStore.getUsedWords(token1)).toBe(1000);

    // Token2 peut encore consommer jusqu'à 300
    expect(tokenStore.consumeWords(token2, 300, limit)).toBe(true);
    expect(tokenStore.getUsedWords(token2)).toBe(1000);
  });

  it('should auto-create usage for token not previously added when consuming', () => {
    const token = 'autoCreatedToken';
    const limit = 1000;

    // Token non ajouté avec add(), mais consumeWords devrait le créer
    expect(tokenStore.consumeWords(token, 500, limit)).toBe(true);
    expect(tokenStore.getUsedWords(token)).toBe(500);
    expect(tokenStore.has(token)).toBe(true);
  });

  it('should clear all tokens with resetAll()', () => {
    const token1 = 'token1';
    const token2 = 'token2';

    tokenStore.add(token1);
    tokenStore.add(token2);
    tokenStore.consumeWords(token1, 500, 1000);

    expect(tokenStore.has(token1)).toBe(true);
    expect(tokenStore.has(token2)).toBe(true);

    tokenStore.resetAll();

    expect(tokenStore.has(token1)).toBe(false);
    expect(tokenStore.has(token2)).toBe(false);
    expect(tokenStore.getUsedWords(token1)).toBe(0);
  });

  it('should accept consuming exactly at the daily limit', () => {
    const token = 'exactLimitToken';
    const limit = 1000;

    tokenStore.add(token);
    
    expect(tokenStore.consumeWords(token, 1000, limit)).toBe(true);
    expect(tokenStore.getUsedWords(token)).toBe(1000);

    // Essayer d'ajouter 1 mot de plus doit échouer
    expect(tokenStore.consumeWords(token, 1, limit)).toBe(false);
    expect(tokenStore.getUsedWords(token)).toBe(1000);
  });

  it('should reject consuming when it would exceed the limit by any amount', () => {
    const token = 'exceedToken';
    const limit = 100;

    tokenStore.add(token);
    tokenStore.consumeWords(token, 90, limit);

    // Essayer d'ajouter 20 mots devrait échouer (total = 110 > 100)
    expect(tokenStore.consumeWords(token, 20, limit)).toBe(false);
    expect(tokenStore.getUsedWords(token)).toBe(90);
  });

  it('should handle multiple consumptions in the same day', () => {
    const token = 'multiConsumptionToken';
    const limit = 500;
    const today = new Date();

    tokenStore.add(token);

    expect(tokenStore.consumeWords(token, 100, limit, today)).toBe(true);
    expect(tokenStore.consumeWords(token, 150, limit, today)).toBe(true);
    expect(tokenStore.consumeWords(token, 200, limit, today)).toBe(true);
    
    expect(tokenStore.getUsedWords(token, today)).toBe(450);

    // Encore 50 disponibles
    expect(tokenStore.consumeWords(token, 50, limit, today)).toBe(true);
    expect(tokenStore.getUsedWords(token, today)).toBe(500);
  });
});