/*
    Justifie une ligne en répartissant uniformément les espaces entre les mots
*/

export default function justifyLine(words: string[], lineWidth: number): string {
    if (words.length === 0) 
        return ' '.repeat(lineWidth);

    if (words.length === 1) 
        return words[0] + ' '.repeat(Math.max(0, lineWidth - words[0].length));
    
    const totalChars = words.reduce((sum, w) => sum + w.length, 0);
    const totalSpaces = Math.max(0, lineWidth - totalChars);
    const gaps = words.length - 1;
    const baseSpace = Math.floor(totalSpaces / gaps);
    let extra = totalSpaces % gaps;

    let result = '';
    for (let i = 0; i < words.length; i++) {
        result += words[i];
        if (i < gaps) {
            const thisGap = baseSpace + (extra > 0 ? 1 : 0);
            result += ' '.repeat(thisGap);
            if (extra > 0) 
                extra--;
        }
    }
    return result;
}