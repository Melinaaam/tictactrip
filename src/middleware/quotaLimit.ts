import * as tokenStore from '../storage/tokenStore'

const DAILY_WORD_LIMIT = 80_000;

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

export default function quotaLimit(req: any, res: any, next: any) {
  const authHeader = req.headers?.authorization;
  if (!authHeader) return res.status(401).send('Unauthorized');

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) return res.status(401).send('Unauthorized');

  const bodyText = typeof req.body === 'string' ? req.body : '';
  const wordsToAdd = countWords(bodyText);

  const ok = tokenStore.consumeWords(token, wordsToAdd, DAILY_WORD_LIMIT);
  if (!ok) return res.status(402).send('Payment Required');

  next();
}
