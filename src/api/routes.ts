/*
Rôle : Définit les routes API pour justifier le texte
Entrée : Requête HTTP avec texte brut dans le corps
Sortie : Réponse HTTP avec texte justifié
*/

import { Router, Request, Response } from 'express';
import justifyText from '../domain/justify/justifyText';

const router = Router();

router.post('/justify', (req: Request, res: Response) => {
    try {
        const text = req.body;

        if (!text || typeof text !== 'string' || text.trim() === '') {
            return res.status(400).json({ error: 'Invalid input text' });
        }

        const justifiedText = justifyText(text, 80);

        res.type('text/plain').send(justifiedText);
    } catch (error) {
        console.error('Error justifying text:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;