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
})

