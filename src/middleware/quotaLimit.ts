// src/middleware/quotaLimit.ts

import * as tokenStore from '../storage/tokenStore'

const DAILY_WORD_LIMIT = 80_000;

function countWords(text: string): number {
  // même logique “tokenizer-like” : split whitespace, ignore vides
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

/*
  quotaLimit :
  - dépend du token (Authorization: Bearer xxx)
  - limite à 80 000 mots / jour / token
  - si dépassement => 402 Payment Required
*/
export default function quotaLimit(req: any, res: any, next: any) {
  const authHeader = req.headers?.authorization;
  if (!authHeader) return res.status(401).send('Unauthorized');

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) return res.status(401).send('Unauthorized');

  // body attendu: text/plain => string
  const bodyText = typeof req.body === 'string' ? req.body : '';
  const wordsToAdd = countWords(bodyText);

  const ok = tokenStore.consumeWords(token, wordsToAdd, DAILY_WORD_LIMIT);
  if (!ok) return res.status(402).send('Payment Required');

  next();
}
