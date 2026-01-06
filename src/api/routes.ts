/*
  Rôle : Définit les routes API pour justifier le texte
  Entrée : Requête HTTP avec texte brut dans le corps
  Sortie : Réponse HTTP avec texte justifié
*/

import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import justifyText from '../domain/justify/justifyText';
import tokenAuth from '../middleware/tokenAuth';
import quotaLimit from '../middleware/quotaLimit';
import { add as addToken } from '../storage/tokenStore';

const router = Router();

router.post('/token', (req: Request, res: Response) => {
  const { email } = req.body ?? {};

  if (!email || typeof email !== 'string' || email.trim() === '') {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const token = crypto.randomBytes(24).toString('hex');
  addToken(token);

  return res.json({ token });
});

router.post('/justify', tokenAuth, quotaLimit, (req: Request, res: Response) => {
  try {
    const text = req.body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ error: 'Invalid input text' });
    }

    const justifiedText = justifyText(text, 80);
    return res.type('text/plain').send(justifiedText);
  } catch (error) {
    console.error('Error justifying text:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
