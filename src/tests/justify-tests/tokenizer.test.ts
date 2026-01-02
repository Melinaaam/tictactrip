import tokenizer from '../../domain/justify/tokenizer'

describe('tokenizer tests', () => {

  // test 1 : whitespace hell
  // Vérifie que tokenizer découpe correctement sur tous les types de séparateurs
  // (espaces multiples, tabs, retours à la ligne) et ne produit jamais de token vide
  test('1) tokenizer handles mixed whitespace correctly', () => {
    const input = 'This  is\tan\nexample.\r\nNew line here.\t\tMultiple spaces.';
    const expectedTokens = [
      'This',
      'is',
      'an',
      'example.',
      'New',
      'line',
      'here.',
      'Multiple',
      'spaces.',
    ];

    expect(tokenizer(input)).toEqual(expectedTokens);
  });

  // test 2 : ponctuation collée aux mots
  // Vérifie que la ponctuation reste attachée au mot
  test('2) tokenizer keeps punctuation attached to words', () => {
    const input = 'Hello, world! This is a test.';
    const expectedTokens = [
      'Hello,',
      'world!',
      'This',
      'is',
      'a',
      'test.',
    ];

    expect(tokenizer(input)).toEqual(expectedTokens);
  });

  // test 3 : mot très long (> 80 caractères)
  // Vérifie que le tokenizer ne coupe pas les mots longs
  // (la règle des 80 caractères est gérée par la justification, pas ici)
  test('3) tokenizer does not split very long words', () => {
    const input = 'A'.repeat(100);
    const expectedTokens = [input];

    expect(tokenizer(input)).toEqual(expectedTokens);
  });

  // test 4 : input vide
  // Vérifie qu'une chaîne vide retourne un tableau vide
  test('4) tokenizer handles empty input', () => {
    const input = '';
    const expectedTokens: string[] = [];

    expect(tokenizer(input)).toEqual(expectedTokens);
  });

  // test 5 : input composé uniquement de whitespace
  // Vérifie que le tokenizer ne retourne pas de tokens vides
  test('5) tokenizer returns empty array for whitespace-only input', () => {
    const input = '   \t\n\r\n   ';
    const expectedTokens: string[] = [];

    expect(tokenizer(input)).toEqual(expectedTokens);
  });

  // test 6 : cas minimal avec un seul mot
  // Vérifie le comportement le plus simple possible
  test('6) tokenizer handles a single word', () => {
    const input = 'Word';
    const expectedTokens = ['Word'];

    expect(tokenizer(input)).toEqual(expectedTokens);
  });
});
