/*
    Entrée : requête HTTP avec header Authorization
    Sortie : si token valide, appel de next(), sinon réponse 401 Unauthorized
    
*/
// Cas à couvrir :
// pas de header Authorization → 401
// header présent mais mauvais format (pas Bearer xxx) → 401
// token inconnu → 401
// token valide → next() appelé

import * as tokenStore from '../storage/tokenStore'

export default function tokenAuth(req: any, res: any, next: any) {
  const authHeader = req.headers?.authorization

  if (!authHeader) {
    return res.status(401).send('Unauthorized')
  }

  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1]) {
    return res.status(401).send('Unauthorized')
  }

  const token = parts[1]

  if (!tokenStore.has(token)) {
    return res.status(401).send('Unauthorized')
  }

  return next()
}