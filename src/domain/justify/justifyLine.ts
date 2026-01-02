/*
Entrée : un tableau de chaînes de caractères (mots) et une largeur de ligne
Sortie : une chaîne de caractères (ligne justifiée)
Rôle : Justifie une ligne de texte en répartissant les espaces entre les mots
*/

export default function justifyLine(words:string[], lineWidth:number):string {
    if (words.length === 0) 
        return ' '.repeat(lineWidth);

    // Un seul mot : on le retourne avec du padding a droite
    if (words.length === 1) 
        return words[0] + ' '.repeat(Math.max(0, lineWidth - words[0].length));
    
    // Calcul du nombre total de caracteres et d'espaces a inserer
    const totalChars = words.reduce((sum, w) => sum + w.length, 0);
    const totalSpaces = Math.max(0, lineWidth - totalChars);
    const gaps = words.length - 1;
    const baseSpace = Math.floor(totalSpaces / gaps);
    let extra = totalSpaces % gaps;

    //result : construction de la ligne justifiee
    let result = '';
    // Parcours des mots et ajout des espaces
    // Pour chaque mot sauf le dernier, on ajoute les espaces calcules
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