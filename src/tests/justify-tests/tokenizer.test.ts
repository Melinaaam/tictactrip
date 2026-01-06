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

  // test 7 : caractères accentués et unicode
  // Vérifie que les accents et caractères spéciaux ne sont pas des séparateurs
  test('7) tokenizer handles accented and unicode characters', () => {
    const input = 'Le café est très bon. Les crêpes sont délicieuses!';
    const expectedTokens = [
      'Le',
      'café',
      'est',
      'très',
      'bon.',
      'Les',
      'crêpes',
      'sont',
      'délicieuses!',
    ];

    expect(tokenizer(input)).toEqual(expectedTokens);
  });

  // test 8 : emojis
  // Vérifie que les emojis sont traités comme des caractères normaux
  test('8) tokenizer handles emojis', () => {
    const input = 'Hello 👋 world 🌍 with emojis 😀';
    const expectedTokens = [
      'Hello',
      '👋',
      'world',
      '🌍',
      'with',
      'emojis',
      '😀',
    ];

    expect(tokenizer(input)).toEqual(expectedTokens);
  });

  // test 9 : nombres
  // Vérifie que les nombres restent intacts
  test('9) tokenizer handles numbers correctly', () => {
    const input = 'The year 2024 has 365 days and 12 months.';
    const expectedTokens = [
      'The',
      'year',
      '2024',
      'has',
      '365',
      'days',
      'and',
      '12',
      'months.',
    ];

    expect(tokenizer(input)).toEqual(expectedTokens);
  });

  // test 10 : tirets et apostrophes
  // Vérifie que les tirets et apostrophes restent attachés aux mots
  test('10) tokenizer keeps hyphens and apostrophes with words', () => {
    const input = "It's a self-driving car. Don't worry!";
    const expectedTokens = [
      "It's",
      'a',
      'self-driving',
      'car.',
      "Don't",
      'worry!',
    ];

    expect(tokenizer(input)).toEqual(expectedTokens);
  });

  // test 11 : whitespace en début et fin
  // Vérifie que les espaces au début et à la fin sont ignorés
  test('11) tokenizer trims leading and trailing whitespace', () => {
    const input = '   Hello world   ';
    const expectedTokens = ['Hello', 'world'];

    expect(tokenizer(input)).toEqual(expectedTokens);
  });

  // test 12 : caractères spéciaux comme @, #, $
  // Vérifie que les caractères spéciaux restent attachés
  test('12) tokenizer handles special characters', () => {
    const input = 'Email: user@example.com #hashtag $price';
    const expectedTokens = [
      'Email:',
      'user@example.com',
      '#hashtag',
      '$price',
    ];

    expect(tokenizer(input)).toEqual(expectedTokens);
  });

  // test 13 : multiples types de whitespace consécutifs
  // Vérifie qu'aucun token vide n'est créé
  test('13) tokenizer handles consecutive different whitespace types', () => {
    const input = 'Word1 \t\n\r\n Word2';
    const expectedTokens = ['Word1', 'Word2'];

    expect(tokenizer(input)).toEqual(expectedTokens);
  });

  // test 14 : texte avec uniquement des tabulations
  // Vérifie que les tabs sont bien traités comme séparateurs
  test('14) tokenizer splits on tabs', () => {
    const input = 'One\tTwo\tThree';
    const expectedTokens = ['One', 'Two', 'Three'];

    expect(tokenizer(input)).toEqual(expectedTokens);
  });
});
