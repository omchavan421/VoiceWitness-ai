import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

// Loads variables from backend/.env when that file exists.
// Phase 1 does not require any secret keys.
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

app.listen(port, '0.0.0.0', () => {
  console.log(`VoiceWitness API is running at http://localhost:${port}`)
})
