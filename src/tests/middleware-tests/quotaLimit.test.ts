// test le quota limit middleware
// < 800000 caractères acceptés, > 800000 rejeté

import quotaLimit from '../../middleware/quotaLimit'


describe('middleware quotaLimit', () => {
  const mockReq = (authorization: string, body: string) => ({
    headers: { authorization },
    body,
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
    const req = mockReq('', 'Some text')
    const res = mockRes()

    quotaLimit(req, res, mockNext)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.send).toHaveBeenCalledWith('Unauthorized')
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should return 402 if quota exceeded', () => {
    const token = 'testToken'
    const tokenStore = require('../../storage/tokenStore')
    tokenStore.add(token)

    const longText = 'word '.repeat(80001) // 80,001 words
    const req = mockReq(`Bearer ${token}`, longText)
    const res = mockRes()

    quotaLimit(req, res, mockNext)

    expect(res.status).toHaveBeenCalledWith(402)
    expect(res.send).toHaveBeenCalledWith('Payment Required')
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should call next() if within quota', () => {
    const token = 'testToken2'
    const tokenStore = require('../../storage/tokenStore')
    tokenStore.add(token)

    const validText = 'word '.repeat(80000) // 80,000 words
    const req = mockReq(`Bearer ${token}`, validText)
    const res = mockRes()

    quotaLimit(req, res, mockNext)

    expect(mockNext).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
    expect(res.send).not.toHaveBeenCalled()
  })

  it('should call next() if body is empty', () => {
    const token = 'emptyBodyToken'
    const tokenStore = require('../../storage/tokenStore')
    tokenStore.add(token)

    const req = mockReq(`Bearer ${token}`, '')
    const res = mockRes()

    quotaLimit(req, res, mockNext)

    expect(mockNext).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })

  it('should handle non-string body as empty', () => {
    const token = 'nonStringToken'
    const tokenStore = require('../../storage/tokenStore')
    tokenStore.add(token)

    const req = mockReq(`Bearer ${token}`, { data: 'test' } as any)
    const res = mockRes()

    quotaLimit(req, res, mockNext)

    expect(mockNext).toHaveBeenCalled()
  })

  it('should return 401 if Bearer scheme is missing', () => {
    const req = mockReq('InvalidToken', 'Some text')
    const res = mockRes()

    quotaLimit(req, res, mockNext)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.send).toHaveBeenCalledWith('Unauthorized')
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should return 401 if token part is missing', () => {
    const req = mockReq('Bearer ', 'Some text')
    const res = mockRes()

    quotaLimit(req, res, mockNext)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.send).toHaveBeenCalledWith('Unauthorized')
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should handle whitespace-only body as 0 words', () => {
    const token = 'whitespaceToken'
    const tokenStore = require('../../storage/tokenStore')
    tokenStore.add(token)

    const req = mockReq(`Bearer ${token}`, '   \t\n  ')
    const res = mockRes()

    quotaLimit(req, res, mockNext)

    expect(mockNext).toHaveBeenCalled()
  })

  it('should accumulate word count across multiple requests', () => {
    const token = 'accumulationToken'
    const tokenStore = require('../../storage/tokenStore')
    tokenStore.add(token)

    // Première requête: 40000 mots
    const text1 = 'word '.repeat(40000)
    const req1 = mockReq(`Bearer ${token}`, text1)
    const res1 = mockRes()
    quotaLimit(req1, res1, mockNext)
    expect(mockNext).toHaveBeenCalled()

    jest.clearAllMocks()

    // Deuxième requête: 40000 mots (total = 80000)
    const text2 = 'word '.repeat(40000)
    const req2 = mockReq(`Bearer ${token}`, text2)
    const res2 = mockRes()
    quotaLimit(req2, res2, mockNext)
    expect(mockNext).toHaveBeenCalled()

    jest.clearAllMocks()

    // Troisième requête: 1 mot (total > 80000) -> doit échouer
    const req3 = mockReq(`Bearer ${token}`, 'word')
    const res3 = mockRes()
    quotaLimit(req3, res3, mockNext)
    expect(res3.status).toHaveBeenCalledWith(402)
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should accept exactly at the limit (80000 words)', () => {
    const token = 'exactLimitToken'
    const tokenStore = require('../../storage/tokenStore')
    tokenStore.add(token)

    const exactText = 'word '.repeat(80000)
    const req = mockReq(`Bearer ${token}`, exactText)
    const res = mockRes()

    quotaLimit(req, res, mockNext)

    expect(mockNext).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })

  it('should reject when exceeding by 1 word', () => {
    const token = 'onOverToken'
    const tokenStore = require('../../storage/tokenStore')
    tokenStore.add(token)

    const overText = 'word '.repeat(80001)
    const req = mockReq(`Bearer ${token}`, overText)
    const res = mockRes()

    quotaLimit(req, res, mockNext)

    expect(res.status).toHaveBeenCalledWith(402)
    expect(res.send).toHaveBeenCalledWith('Payment Required')
  })
})

