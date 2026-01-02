/*
Entrée : une chaîne de caractères (texte brut)
Sortie : un tableau de chaînes de caractères (tokens/mots)
Role : découpe le texte en mots en utilisant les espaces, tabulations et retours à la ligne comme séparateurs
*/

export default function tokenizer(text: string): string[] {
  if (!text) 
    return [];
  // Utilise une expression régulière pour découper sur tous les types de whitespace
  // \s =>  caractères d'espacement (espace, tab, retour à la ligne, etc.) et '+' => "un ou plusieurs"
  const rawTokens = text.split(/\s+/);

  // Filtre les tokens vides (peuvent apparaître si le texte commence ou finit par des espaces)
  const tokens = rawTokens.filter(token => token.length > 0);
  return tokens;
}