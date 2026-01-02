import request from 'supertest'
import express from 'express'
import router from '../../api/routes'

// Créer une app Express pour les tests
const app = express()
app.use(express.text({ type: 'text/plain', limit: '10mb' }))
app.use('/api', router)

describe('API Routes - /api/justify', () => {
  
  // Test 1 : requête valide avec texte simple
  test('POST /api/justify - returns justified text for valid request', async () => {
    const text = 'Hello world this is a test'
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .send(text)
    
    expect(response.status).toBe(200)
    expect(response.type).toBe('text/plain')
    expect(typeof response.text).toBe('string')
  })

  // Test 2 : texte vide
  test('POST /api/justify - returns 400 for empty text', async () => {
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .send('')
    
    expect(response.status).toBe(400)
    expect(response.body.error).toBeDefined()
  })

  // Test 3 : body non string (JSON)
  test('POST /api/justify - returns 400 for JSON body', async () => {
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'application/json')
      .send({ data: 'test' })
    
    expect(response.status).toBe(400)
  })

  // Test 4 : texte long nécessitant plusieurs lignes
  test('POST /api/justify - justifies long text into multiple lines', async () => {
    const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.'
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
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
    const text = 'Hello, world! How are you? I am fine, thank you.'
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .send(text)
    
    expect(response.status).toBe(200)
    expect(response.text).toContain(',')
    expect(response.text).toContain('!')
    expect(response.text).toContain('?')
  })

  // Test 6 : texte avec caractères spéciaux et accents
  test('POST /api/justify - handles accented characters', async () => {
    const text = 'Le café est très bon. Les crêpes sont délicieuses. J\'adore le français!'
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .send(text)
    
    expect(response.status).toBe(200)
    expect(response.text).toContain('café')
    expect(response.text).toContain('très')
  })

  // Test 7 : texte avec whitespace mixte
  test('POST /api/justify - handles mixed whitespace', async () => {
    const text = 'Hello  \t  world\n\nThis   is\ta\ttest'
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .send(text)
    
    expect(response.status).toBe(200)
  })

  // Test 8 : mot très long (> 80 caractères)
  test('POST /api/justify - handles very long words', async () => {
    const longWord = 'A'.repeat(100)
    const text = `Hello ${longWord} world`
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .send(text)
    
    expect(response.status).toBe(200)
    expect(response.text).toContain(longWord)
  })

  // Test 9 : texte d'une seule ligne (< 80 caractères)
  test('POST /api/justify - returns single line for short text', async () => {
    const text = 'Short text'
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .send(text)
    
    expect(response.status).toBe(200)
    expect(response.text.split('\n').length).toBe(1)
  })

  // Test 10 : texte avec uniquement des espaces
  test('POST /api/justify - returns 400 for whitespace-only text', async () => {
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .send('   \n\t  ')
    
    expect(response.status).toBe(400)
  })

  // Test 11 : texte avec chiffres
  test('POST /api/justify - handles text with numbers', async () => {
    const text = 'The year 2024 is special. We have 365 days and 12 months.'
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .send(text)
    
    expect(response.status).toBe(200)
    expect(response.text).toContain('2024')
    expect(response.text).toContain('365')
  })

  // Test 12 : texte avec plusieurs paragraphes
  test('POST /api/justify - handles multiple paragraphs', async () => {
    const text = 'First paragraph.\n\nSecond paragraph.'
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
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
    const text = 'Hello 👋 world 🌍 with emojis 😀'
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .send(text)
    
    expect(response.status).toBe(200)
  })

  // Test 16 : texte avec plusieurs espaces consécutifs
  test('POST /api/justify - normalizes multiple spaces', async () => {
    const text = 'Hello     world     test'
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .send(text)
    
    expect(response.status).toBe(200)
  })
})