// Cas à couvrir :
// pas de header Authorization → 401
// header présent mais mauvais format (pas Bearer xxx) → 401
// token inconnu → 401
// token valide → next() appelé

import tokenAuth from '../../middleware/tokenAuth'
describe('middleware tokenAuth', () => {
  const mockReq = (authorization?: string) => ({
    headers: authorization ? { authorization } : {},
  })

  const mockRes = () => {
    const res: any = {}
    res.status = jest.fn().mockReturnValue(res)
    res.send = jest.fn().mockReturnValue(res)
    return res
  }

  const mockNext = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 401 if no Authorization header', () => {
    const req = mockReq()
    const res = mockRes()

    tokenAuth(req, res, mockNext)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.send).toHaveBeenCalledWith('Unauthorized')
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should return 401 if Authorization header has wrong format', () => {
    const req = mockReq('InvalidFormatToken')
    const res = mockRes()

    tokenAuth(req, res, mockNext)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.send).toHaveBeenCalledWith('Unauthorized')
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should return 401 if token is unknown', () => {
    const req = mockReq('Bearer unknownToken')
    const res = mockRes()

    tokenAuth(req, res, mockNext)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.send).toHaveBeenCalledWith('Unauthorized')
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should call next() if token is valid', () => {
    const validToken = 'validToken'
    // Pré-ajout du token valide dans le tokenStore
    const tokenStore = require('../../storage/tokenStore')
    tokenStore.add(validToken)

    const req = mockReq(`Bearer ${validToken}`)
    const res = mockRes()

    tokenAuth(req, res, mockNext)

    expect(mockNext).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
    expect(res.send).not.toHaveBeenCalled()
  })

  it('should return 401 if Authorization header is empty', () => {
    const req = mockReq('')
    const res = mockRes()

    tokenAuth(req, res, mockNext)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.send).toHaveBeenCalledWith('Unauthorized')
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should return 401 if Bearer keyword is present but token is missing', () => {
    const req = mockReq('Bearer ')
    const res = mockRes()

    tokenAuth(req, res, mockNext)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.send).toHaveBeenCalledWith('Unauthorized')
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should return 401 if only Bearer keyword without space', () => {
    const req = mockReq('Bearer')
    const res = mockRes()

    tokenAuth(req, res, mockNext)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.send).toHaveBeenCalledWith('Unauthorized')
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should return 401 if scheme is lowercase "bearer"', () => {
    const req = mockReq('bearer someToken')
    const res = mockRes()

    tokenAuth(req, res, mockNext)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.send).toHaveBeenCalledWith('Unauthorized')
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should set req.token when token is valid', () => {
    const validToken = 'myValidToken123'
    const tokenStore = require('../../storage/tokenStore')
    tokenStore.add(validToken)

    const req: any = mockReq(`Bearer ${validToken}`)
    const res = mockRes()

    tokenAuth(req, res, mockNext)

    expect(req.token).toBe(validToken)
    expect(mockNext).toHaveBeenCalled()
  })

  it('should handle token with special characters', () => {
    const validToken = 'token-with-special_chars.123'
    const tokenStore = require('../../storage/tokenStore')
    tokenStore.add(validToken)

    const req: any = mockReq(`Bearer ${validToken}`)
    const res = mockRes()

    tokenAuth(req, res, mockNext)

    expect(mockNext).toHaveBeenCalled()
    expect(req.token).toBe(validToken)
  })

  it('should return 401 if Authorization has extra parts', () => {
    const req = mockReq('Bearer token extraPart')
    const res = mockRes()

    tokenAuth(req, res, mockNext)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.send).toHaveBeenCalledWith('Unauthorized')
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should return 401 if Authorization has different scheme', () => {
    const req = mockReq('Basic someToken')
    const res = mockRes()

    tokenAuth(req, res, mockNext)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.send).toHaveBeenCalledWith('Unauthorized')
    expect(mockNext).not.toHaveBeenCalled()
  })
})