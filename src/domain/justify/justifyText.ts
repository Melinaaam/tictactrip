import tokenizer from './tokenizer';
import justifyLine from './justifyLine';
/*
Entrée : un texte brut + une largeur de ligne 80 caractères
Sortie : un texte complet justifié (plusieurs lignes séparés par \n )
Rôle : orchester la justification de texte en utilisant le tokenizer (pour découper le texte en mots) et justifyLine (pour justifier chaque ligne)
*/

export default function justifyText(text: string, lineWidth: number = 80): string {

    // Découpe le texte en mots
    const words = tokenizer(text);
    const lines: string[] = [];
    let currentLineWords: string[] = [];
    let currentLineLength = 0;

    // Construction des lignes
    for (const word of words) {
        // Calcule la longueur nécessaire si on ajoute ce mot
        const spaceNeeded = currentLineWords.length > 0 ? 1 : 0; // espace avant le mot
        const totalLength = currentLineLength + spaceNeeded + word.length;
        
        // Vérifie si l'ajout du mot dépasse la largeur de ligne
        if (totalLength <= lineWidth) {
            currentLineWords.push(word);
            currentLineLength = totalLength;
        } else {
            // Justifie la ligne actuelle et la stocke
            if (currentLineWords.length > 0) {
                lines.push(justifyLine(currentLineWords, lineWidth));
            }
            // Démarre une nouvelle ligne avec le mot courant
            currentLineWords = [word];
            currentLineLength = word.length;
        }
    }

    // Justifie et ajoute la dernière ligne si elle contient des mots
    if (currentLineWords.length > 0) {
        lines.push(currentLineWords.join(' '));
    }

    // Combine toutes les lignes justifiées en une seule chaîne avec des retours à la ligne
    return lines.join('\n');
}