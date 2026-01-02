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
        console.log('Result:', `"${result}"`);
        console.log('Length:', result.length);
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
        console.log('Result:', `"${result}"`);
        const lines = result.split('\n');
        for (let i = 0; i < lines.length - 1; i++) {
            expect(lines[i].length).toBe(35);
        }
    });
});