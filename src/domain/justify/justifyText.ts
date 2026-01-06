/*
    Justifie un texte complet en lignes de largeur fixe
    Utilise tokenizer pour découper et justifyLine pour formater chaque ligne
*/

import tokenizer from './tokenizer';
import justifyLine from './justifyLine';

export default function justifyText(text: string, lineWidth: number = 80): string {
    const words = tokenizer(text);
    const lines: string[] = [];
    let currentLineWords: string[] = [];
    let currentLineLength = 0;

    for (const word of words) {
        const spaceNeeded = currentLineWords.length > 0 ? 1 : 0;
        const totalLength = currentLineLength + spaceNeeded + word.length;
        
        if (totalLength <= lineWidth) {
            currentLineWords.push(word);
            currentLineLength = totalLength;
        } else {
            if (currentLineWords.length > 0) {
                lines.push(justifyLine(currentLineWords, lineWidth));
            }
            currentLineWords = [word];
            currentLineLength = word.length;
        }
    }

    // Dernière ligne : left-aligned (non justifiée)
    if (currentLineWords.length > 0) {
        lines.push(currentLineWords.join(' '));
    }
    return lines.join('\n');
}