// tests for justifyLine
import justifyLine from '../../domain/justify/justifyLine'

describe('justifyLine', () => {
  // Test 1 : plusieurs mots -> répartit les espaces sur tous les "trous"
  test('justifies a line with multiple words by spreading spaces', () => {
    const words = ['This', 'is', 'an', 'example']
    const lineWidth = 20
    const justified = justifyLine(words, lineWidth)
    expect(justified).toBe('This  is  an example') // 2 spaces per gap + 1 extra on the left
  })

  // Test 2 : un seul mot -> padding à droite
  test('pads with spaces when the line contains a single word', () => {
    const words = ['Hello']
    const lineWidth = 10
    const justified = justifyLine(words, lineWidth)
    expect(justified).toBe('Hello     ')
  })

  // Test 3 : deux mots -> tout l’espace va dans l’unique trou
  test('puts all extra spaces in the single gap when there are two words', () => {
    const words = ['Hello', 'World']
    const lineWidth = 15
    const justified = justifyLine(words, lineWidth)
    expect(justified).toBe('Hello     World')
  })

  // Test 4 : déjà exactement à la bonne largeur (avec 1 espace entre mots)
  test('returns the same string when already exactly at given width', () => {
    const words = ['Perfectly', 'justified']
    const lineWidth = 19 // "Perfectly"(9) + 1 + "justified"(9) = 19
    const justified = justifyLine(words, lineWidth)
    expect(justified).toBe('Perfectly justified')
  })

  // Test 5 : ponctuation = caractère normal, ne change rien au calcul
  test('handles punctuation as regular characters', () => {
    const words = ['Hello,', 'world!']
    const lineWidth = 20
    const justified = justifyLine(words, lineWidth)
    expect(justified).toBe('Hello,        world!')
  })

  // Test 6 : accents = caractères normaux (attention: en JS, certains emojis comptent différemment)
  test('handles accented characters as regular characters', () => {
    const words = ['Café', 'au', 'lait']
    const lineWidth = 15
    const justified = justifyLine(words, lineWidth)
    expect(justified).toBe('Café   au  lait')
  })

  // Test 7 : si width trop petit pour justifier, on retombe sur "join(' ')"
  test('falls back to single spaces if width is too small to justify', () => {
    const words = ['A', 'B', 'C']
    const lineWidth = 5 // "A B C" = 5
    const justified = justifyLine(words, lineWidth)
    expect(justified).toBe('A B C')
  })

  // Test 8 : un mot très long = pas de padding si déjà égal à width
  test('returns the word as-is when a single word already matches the width', () => {
    const words = ['Supercalifragilisticexpialidocious']
    const lineWidth = 34
    const justified = justifyLine(words, lineWidth)
    expect(justified).toBe('Supercalifragilisticexpialidocious')
  })
})
