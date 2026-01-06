/*
  Découpe un texte en mots en utilisant les espaces comme séparateurs
*/

export default function tokenizer(text: string): string[] {
  if (!text) 
    return [];
  
  const rawTokens = text.split(/\s+/);
  const tokens = rawTokens.filter(token => token.length > 0);
  return tokens;
}