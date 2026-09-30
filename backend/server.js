import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { analyzePublicIssue, issueRequestSchema } from './analyzeReport.js'

// Loads variables from backend/.env. The Gemini key stays in that file.
dotenv.config()

const app = express()
const port = process.env.PORT || 47821
const frontendUrl = normalizeOrigin(process.env.FRONTEND_URL)
const productionOrigin = 'https://voicewitness-ai-public.vercel.app'

app.use(cors({
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true)
      return
    }
    callback(null, false)
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'VoiceWitness API is running',
  })
})

app.post('/api/analyze', async (req, res) => {
  const parsed = issueRequestSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid issue description.',
    })
  }

  try {
    const data = await analyzePublicIssue(parsed.data.text)
    return res.json({ success: true, data })
  } catch (error) {
    if (error.code === 'NOT_CONFIGURED') {
      return res.status(500).json({
        success: false,
        error: 'AI service is not configured yet.',
      })
    }

    console.error('AI analysis failed:', safeErrorMessage(error))
    res.set('X-VoiceWitness-Error', publicFailureKind(error))
    return res.status(500).json({
      success: false,
      error: 'AI analysis failed. Please try again.',
    })
  }
})

app.use((error, req, res, next) => {
  if (error?.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid issue description.',
    })
  }

  console.error('Request failed:', safeErrorMessage(error))
  return res.status(500).json({
    success: false,
    error: 'AI analysis failed. Please try again.',
  })
})

function normalizeOrigin(value) {
  return (value || '').trim().replace(/\/$/, '')
}

function isAllowedOrigin(origin) {
  if (!origin) return true

  const normalized = normalizeOrigin(origin)
  if (normalized === productionOrigin) return true
  if (frontendUrl && normalized === frontendUrl) return true

  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalized)
}

function publicFailureKind(error) {
  const status = Number(error?.cause?.status || error?.status || 0)
  const message = String(error?.cause?.message || error?.message || '')
  if (
    status === 400 ||
    status === 401 ||
    status === 403 ||
    /API key not valid|API_KEY_INVALID|PERMISSION_DENIED/.test(message)
  ) {
    return 'auth'
  }
  if (status === 404 || /NOT_FOUND|not found/i.test(message)) return 'model'
  return 'upstream'
}

function safeErrorMessage(error) {
  const secret = process.env.GEMINI_API_KEY?.trim()
  const cause = error?.cause?.message || error?.message || 'Unknown error'
  if (!secret) return cause
  return cause.split(secret).join('[redacted]')
}

app.listen(port, '0.0.0.0', () => {
  console.log(`VoiceWitness API is running at http://localhost:${port}`)
})
