import justifyText from '../../domain/justify/justifyText';

// test suite for justifyText function
describe('justifyText', () => {
    test('justifies a simple text within line width', () => {
        const input = 'This is a simple test.';
        const result = justifyText(input, 22);
        expect(result.length).toBe(22);
        expect(result).toBe('This is a simple test.');
    });

    test('justifies text to 80 characters', () => {
        const input = 'This is another simple test.';
        const result = justifyText(input, 80);
        expect(result.length).toBe(28);
        expect(result.startsWith('This')).toBe(true);
        expect(result.endsWith('test.')).toBe(true);
    });

    test('handles empty string input', () => {
        const input = '';
        const expected = '';
        const result = justifyText(input, 80);
        expect(result).toBe(expected);
    });

    test('justifies text that requires multiple lines', () => {
        const input = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
        const result = justifyText(input, 50);
        const lines = result.split('\n');
        expect(lines.length).toBeGreaterThan(1);
        for (let i = 0; i < lines.length - 1; i++) {
            expect(lines[i].length).toBe(50);
        }
    });

    test('handles single long word exceeding line width', () => {
        const input = 'Supercalifragilisticexpialidocious';
        const expected = 'Supercalifragilisticexpialidocious';
        const result = justifyText(input, 20);
        expect(result).toBe(expected);
    });

    test('handles text with punctuation correctly', () => {
        const input = 'Hello, world! This is a test.';
        const result = justifyText(input, 35);
        const lines = result.split('\n');
        for (let i = 0; i < lines.length - 1; i++) {
            expect(lines[i].length).toBe(35);
        }
    });

    test('last line is not justified (left-aligned only)', () => {
        const input = 'First line needs more words here. Last line.';
        const result = justifyText(input, 30);
        const lines = result.split('\n');
        expect(lines.length).toBeGreaterThan(1);
        // La dernière ligne devrait être left-aligned (espaces simples)
        const lastLine = lines[lines.length - 1];
        // La dernière ligne ne devrait pas être justifiée (max 1 espace entre les mots)
        expect(lastLine.includes('  ')).toBe(false); // Pas de double espace dans la dernière ligne
        expect(lastLine).toContain('line');
    });

    test('handles text with multiple consecutive spaces', () => {
        const input = 'Hello    world    with    spaces';
        const result = justifyText(input, 30);
        expect(result).toBeDefined();
        expect(result.includes('    ')).toBe(false); // Pas de 4 espaces consécutifs dans le résultat justifié
    });

    test('handles text with newlines', () => {
        const input = 'First paragraph.\n\nSecond paragraph.';
        const result = justifyText(input, 30);
        expect(result).toBeDefined();
        // Les \n sont traités comme des espaces par tokenizer
        expect(result.includes('paragraph')).toBe(true);
    });

    test('handles very small line width', () => {
        const input = 'a b c d';
        const result = justifyText(input, 5);
        const lines = result.split('\n');
        expect(lines.length).toBeGreaterThan(1);
    });

    test('handles accented characters and unicode', () => {
        const input = 'Le café est très bon et les crêpes sont délicieuses.';
        const result = justifyText(input, 30);
        expect(result).toContain('café');
        expect(result).toContain('très');
        expect(result).toContain('crêpes');
    });

    test('handles word exactly matching line width', () => {
        const word = 'A'.repeat(30);
        const input = `Start ${word} End`;
        const result = justifyText(input, 30);
        const lines = result.split('\n');
        expect(lines).toContain(word);
    });

    test('verifies all lines except last are exactly lineWidth', () => {
        const input = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua';
        const lineWidth = 40;
        const result = justifyText(input, lineWidth);
        const lines = result.split('\n');
        
        // Toutes les lignes sauf la dernière doivent faire exactement lineWidth
        for (let i = 0; i < lines.length - 1; i++) {
            expect(lines[i].length).toBe(lineWidth);
        }
        
        // La dernière ligne peut être plus courte
        const lastLine = lines[lines.length - 1];
        expect(lastLine.length).toBeLessThanOrEqual(lineWidth);
    });

    test('handles text with only whitespace', () => {
        const input = '   \n\t  ';
        const result = justifyText(input, 80);
        expect(result).toBe('');
    });

    test('handles single word per line scenario', () => {
        const input = 'superlongword another verylongword';
        const result = justifyText(input, 15);
        const lines = result.split('\n');
        expect(lines.length).toBeGreaterThan(1);
    });
});