/*
    Entrée : requête HTTP avec header Authorization
    Sortie : si token valide, appel de next(), sinon réponse 401 Unauthorized
*/

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
(req as any).token = token;
  return next()
}