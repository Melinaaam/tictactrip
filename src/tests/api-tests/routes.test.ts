import request from 'supertest'
import express from 'express'
import router from '../../api/routes'

// Création d'une app Express pour les tests
const app = express()
app.use(express.json()) 
app.use(express.text({ type: 'text/plain', limit: '10mb' }))
app.use('/api', router)

// Helper pour obtenir un token valide
async function getValidToken(): Promise<string> {
  const response = await request(app)
    .post('/api/token')
    .send({ email: 'test@example.com' })
  return response.body.token
}

describe('API Routes - /api/token', () => {
  
  test('POST /api/token - returns a token for valid email', async () => {
    const response = await request(app)
      .post('/api/token')
      .send({ email: 'test@example.com' })
    
    expect(response.status).toBe(200)
    expect(response.body.token).toBeDefined()
    expect(typeof response.body.token).toBe('string')
    expect(response.body.token.length).toBeGreaterThan(0)
  })

  test('POST /api/token - returns 400 for missing email', async () => {
    const response = await request(app)
      .post('/api/token')
      .send({})
    
    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Invalid email')
  })

  test('POST /api/token - returns 400 for empty email', async () => {
    const response = await request(app)
      .post('/api/token')
      .send({ email: '' })
    
    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Invalid email')
  })

  test('POST /api/token - returns 400 for whitespace-only email', async () => {
    const response = await request(app)
      .post('/api/token')
      .send({ email: '   ' })
    
    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Invalid email')
  })

  test('POST /api/token - returns 400 for non-string email', async () => {
    const response = await request(app)
      .post('/api/token')
      .send({ email: 123 })
    
    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Invalid email')
  })
})

describe('API Routes - /api/justify', () => {
  
  // Test 1 : requête valide avec texte simple
  test('POST /api/justify - returns justified text for valid request', async () => {
    const token = await getValidToken()
    const text = 'Hello world this is a test'
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .set('Authorization', `Bearer ${token}`)
      .send(text)
    
    expect(response.status).toBe(200)
    expect(response.type).toBe('text/plain')
    expect(typeof response.text).toBe('string')
  })

  // Test 2 : texte vide
  test('POST /api/justify - returns 400 for empty text', async () => {
    const token = await getValidToken()
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .set('Authorization', `Bearer ${token}`)
      .send('')
    
    expect(response.status).toBe(400)
    expect(response.body.error).toBeDefined()
  })

  // Test 3 : body non string (JSON)
  test('POST /api/justify - returns 400 for JSON body', async () => {
    const token = await getValidToken()
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ data: 'test' })
    
    expect(response.status).toBe(400)
  })

  // Test 4 : texte long nécessitant plusieurs lignes
  test('POST /api/justify - justifies long text into multiple lines', async () => {
    const token = await getValidToken()
    const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.'
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .set('Authorization', `Bearer ${token}`)
      .send(text)
    
    expect(response.status).toBe(200)
    const lines = response.text.split('\n')
    expect(lines.length).toBeGreaterThan(1)
    
    for (let i = 0; i < lines.length - 1; i++) {
      expect(lines[i].length).toBe(80)
    }
  })

  // Test 5 : texte avec ponctuation
  test('POST /api/justify - preserves punctuation', async () => {
    const token = await getValidToken()
    const text = 'Hello, world! How are you? I am fine, thank you.'
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .set('Authorization', `Bearer ${token}`)
      .send(text)
    
    expect(response.status).toBe(200)
    expect(response.text).toContain(',')
    expect(response.text).toContain('!')
    expect(response.text).toContain('?')
  })

  // Test 6 : texte avec caractères spéciaux et accents
  test('POST /api/justify - handles accented characters', async () => {
    const token = await getValidToken()
    const text = 'Le café est très bon. Les crêpes sont délicieuses. J\'adore le français!'
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .set('Authorization', `Bearer ${token}`)
      .send(text)
    
    expect(response.status).toBe(200)
    expect(response.text).toContain('café')
    expect(response.text).toContain('très')
  })

  // Test 7 : texte avec whitespace mixte
  test('POST /api/justify - handles mixed whitespace', async () => {
    const token = await getValidToken()
    const text = 'Hello  \t  world\n\nThis   is\ta\ttest'
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .set('Authorization', `Bearer ${token}`)
      .send(text)
    
    expect(response.status).toBe(200)
  })

  // Test 8 : mot très long (> 80 caractères)
  test('POST /api/justify - handles very long words', async () => {
    const token = await getValidToken()
    const longWord = 'A'.repeat(100)
    const text = `Hello ${longWord} world`
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .set('Authorization', `Bearer ${token}`)
      .send(text)
    
    expect(response.status).toBe(200)
    expect(response.text).toContain(longWord)
  })

  // Test 9 : texte d'une seule ligne (< 80 caractères)
  test('POST /api/justify - returns single line for short text', async () => {
    const token = await getValidToken()
    const text = 'Short text'
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .set('Authorization', `Bearer ${token}`)
      .send(text)
    
    expect(response.status).toBe(200)
    expect(response.text.split('\n').length).toBe(1)
  })

  // Test 10 : texte avec uniquement des espaces
  test('POST /api/justify - returns 400 for whitespace-only text', async () => {
    const token = await getValidToken()
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .set('Authorization', `Bearer ${token}`)
      .send('   \n\t  ')
    
    expect(response.status).toBe(400)
  })

  // Test 11 : texte avec chiffres
  test('POST /api/justify - handles text with numbers', async () => {
    const token = await getValidToken()
    const text = 'The year 2024 is special. We have 365 days and 12 months.'
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .set('Authorization', `Bearer ${token}`)
      .send(text)
    
    expect(response.status).toBe(200)
    expect(response.text).toContain('2024')
    expect(response.text).toContain('365')
  })

  // Test 12 : texte avec plusieurs paragraphes
  test('POST /api/justify - handles multiple paragraphs', async () => {
    const token = await getValidToken()
    const text = 'First paragraph.\n\nSecond paragraph.'
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .set('Authorization', `Bearer ${token}`)
      .send(text)
    
    expect(response.status).toBe(200)
    expect(response.text.length).toBeGreaterThan(0)
  })

  // Test 13 : route inexistante
  test('POST /api/unknown - returns 404 for unknown route', async () => {
    const response = await request(app)
      .post('/api/unknown')
      .send('test')
    
    expect(response.status).toBe(404)
  })

  // Test 14 : méthode GET non supportée
  test('GET /api/justify - returns 404 for GET method', async () => {
    const response = await request(app)
      .get('/api/justify')
    
    expect(response.status).toBe(404)
  })

  // Test 15 : texte avec caractères Unicode
  test('POST /api/justify - handles Unicode characters', async () => {
    const token = await getValidToken()
    const text = 'Hello 👋 world 🌍 with emojis 😀'
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .set('Authorization', `Bearer ${token}`)
      .send(text)
    
    expect(response.status).toBe(200)
  })

  // Test 16 : texte avec plusieurs espaces consécutifs
  test('POST /api/justify - normalizes multiple spaces', async () => {
    const token = await getValidToken()
    const text = 'Hello     world     test'
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .set('Authorization', `Bearer ${token}`)
      .send(text)
    
    expect(response.status).toBe(200)
  })
})

describe('API Routes - Authentication Tests', () => {
  
  test('POST /api/justify - returns 401 without Authorization header', async () => {
    const text = 'Hello world'
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .send(text)
    
    expect(response.status).toBe(401)
    expect(response.text).toBe('Unauthorized')
  })

  test('POST /api/justify - returns 401 with invalid token format', async () => {
    const text = 'Hello world'
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .set('Authorization', 'InvalidFormat')
      .send(text)
    
    expect(response.status).toBe(401)
    expect(response.text).toBe('Unauthorized')
  })

  test('POST /api/justify - returns 401 with unknown token', async () => {
    const text = 'Hello world'
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .set('Authorization', 'Bearer unknown-token-123')
      .send(text)
    
    expect(response.status).toBe(401)
    expect(response.text).toBe('Unauthorized')
  })

  test('POST /api/justify - returns 200 with valid token', async () => {
    // Obtenir un token valide
    const tokenResponse = await request(app)
      .post('/api/token')
      .send({ email: 'test@example.com' })
    
    const token = tokenResponse.body.token
    
    // Utiliser le token pour justifier du texte
    const text = 'Hello world this is a test'
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .set('Authorization', `Bearer ${token}`)
      .send(text)
    
    expect(response.status).toBe(200)
    expect(response.type).toBe('text/plain')
    expect(typeof response.text).toBe('string')
  })
})

describe('API Routes - Quota Limit Tests', () => {
  
  test('POST /api/justify - returns 402 when exceeding 80000 words quota', async () => {
    // Obtenir un token
    const tokenResponse = await request(app)
      .post('/api/token')
      .send({ email: 'quota-test@example.com' })
    
    const token = tokenResponse.body.token
    
    // Créer un texte de ~10000 mots (pour ne pas envoyer 80000 mots en une fois)
    const longWord = 'word '
    const text = longWord.repeat(10000) // 10000 mots
    
    // Envoyer 8 fois pour dépasser 80000 mots
    for (let i = 0; i < 8; i++) {
      await request(app)
        .post('/api/justify')
        .set('Content-Type', 'text/plain')
        .set('Authorization', `Bearer ${token}`)
        .send(text)
    }
    
    // La 9e requête devrait échouer avec 402
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .set('Authorization', `Bearer ${token}`)
      .send(text)
    
    expect(response.status).toBe(402)
    expect(response.text).toBe('Payment Required')
  })

  test('POST /api/justify - allows requests under quota', async () => {
    // Obtenir un nouveau token
    const tokenResponse = await request(app)
      .post('/api/token')
      .send({ email: 'under-quota@example.com' })
    
    const token = tokenResponse.body.token
    
    // Envoyer un petit texte
    const text = 'Hello world this is a small test'
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .set('Authorization', `Bearer ${token}`)
      .send(text)
    
    expect(response.status).toBe(200)
  })
})