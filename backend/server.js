import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { analyzePublicIssue, issueRequestSchema } from './analyzeReport.js'

// Loads variables from backend/.env. The Gemini key stays in that file.
dotenv.config()

const app = express()
const port = process.env.PORT || 47821

app.use(cors())
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

function safeErrorMessage(error) {
  const secret = process.env.GEMINI_API_KEY?.trim()
  const cause = error?.cause?.message || error?.message || 'Unknown error'
  if (!secret) return cause
  return cause.split(secret).join('[redacted]')
}

app.listen(port, '0.0.0.0', () => {
  console.log(`VoiceWitness API is running at http://localhost:${port}`)
})
