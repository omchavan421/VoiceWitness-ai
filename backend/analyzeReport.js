import { GoogleGenAI } from '@google/genai'
import { z } from 'zod'

// gemini-3.8-flash is the current Flash model. The lite alias is only a backup
// when Flash is temporarily busy.
const MODELS = [
  'gemini-3.8-flash',
  'gemini-flash-lite-latest',
  'gemini-3.5-flash',
  'gemini-2.5-flash',
]

export const issueRequestSchema = z.object({
  text: z.string().trim().min(5).max(5000),
})

const analysisSchema = z.object({
  issue: z.string().trim().min(1),
  category: z.string().trim().min(1),
  subCategory: z.string().trim(),
  location: z.string().trim(),
  urgency: z.enum(['low', 'medium', 'high']),
  authority: z.string().trim().min(1),
  description: z.string().trim().min(1),
  evidenceRequired: z.boolean(),
  evidenceRecommendation: z.string().trim(),
  missingInformation: z.array(z.string().trim()).max(6),
  followUpQuestion: z.string().trim(),
  safetyAdvice: z.string().trim(),
})

const responseJsonSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    issue: { type: 'string' },
    category: { type: 'string' },
    subCategory: { type: 'string' },
    location: { type: 'string' },
    urgency: { type: 'string', enum: ['low', 'medium', 'high'] },
    authority: { type: 'string' },
    description: { type: 'string' },
    evidenceRequired: { type: 'boolean' },
    evidenceRecommendation: { type: 'string' },
    missingInformation: {
      type: 'array',
      items: { type: 'string' },
    },
    followUpQuestion: { type: 'string' },
    safetyAdvice: { type: 'string' },
  },
  required: [
    'issue',
    'category',
    'subCategory',
    'location',
    'urgency',
    'authority',
    'description',
    'evidenceRequired',
    'evidenceRecommendation',
    'missingInformation',
    'followUpQuestion',
    'safetyAdvice',
  ],
}

const systemInstruction = `You are VoiceWitness AI — Public Issue Understanding Engine.

You are not a general chatbot. You convert one unstructured description of a real-world public problem into a structured report.

Understand English, Hindi, Marathi, and Hinglish. Write the structured fields in clear English while preserving the user's meaning.

Identify only what the user actually said:
- what happened
- the issue type
- where it happened
- how urgent it is
- which authority should receive it
- what evidence would help
- what important information is missing
- one safety note when the situation is dangerous

Rules:
- Never invent facts.
- Never invent an exact location, street, landmark, or city. "Near my college" may become "Near the user's college". "Near my college gate" may become "Near the user's college gate". "Near my home" may become "Near the user's home". If the place was not stated, leave location as an empty string and ask where it is.
- Do not exaggerate urgency. Use high when the user describes immediate danger, including vehicles or people falling or almost falling, people passing a hanging wire, fire, gas, or a collapsing structure. "Bikes are almost falling" is high. A non-working streetlight with no immediate hazard is medium.
- Ask only one follow-up question. If important information is missing, put a short label in missingInformation, such as "location", and put that one question in followUpQuestion. If nothing important is missing, missingInformation must be [] and followUpQuestion must be "".
- Do not ask several questions.
- For exposed wires, fire, gas leaks, dangerous structures, active traffic danger, or other immediate physical danger, give a short safetyAdvice. For a hanging electrical wire, use advice like "Do not approach or touch the wire. Keep a safe distance."
- Evidence must be safety-aware. Never tell the user to approach danger for a photo. For a hanging wire, recommend a photo or video only from a safe distance.
- urgency must be exactly "low", "medium", or "high".
- Return only the requested JSON object.

Useful categories include Road Safety, Street Lighting, Electricity, Water & Drainage, Waste Management, Public Transport, Traffic, Public Infrastructure, Public Safety, Environment, Animal-related, and Other. Choose another clear category only when none of these fit.`

function readApiKey() {
  let value = process.env.GEMINI_API_KEY?.trim() || ''
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1).trim()
  }
  return value
}

function shouldTryNextModel(error) {
  const status = Number(error?.status)
  if ([404, 408, 429, 500, 502, 503, 504].includes(status)) return true
  const message = String(error?.message || '')
  return (
    message.includes('503') ||
    message.includes('UNAVAILABLE') ||
    message.includes('high demand') ||
    message.includes('NOT_FOUND') ||
    message.includes('not found')
  )
}

function normalizeModelJson(value) {
  const record = value && typeof value === 'object' ? { ...value } : {}

  if (typeof record.urgency === 'string') {
    record.urgency = record.urgency.trim().toLowerCase()
  }

  if (typeof record.evidenceRequired === 'string') {
    record.evidenceRequired = record.evidenceRequired.trim().toLowerCase() === 'true'
  }

  if (!Array.isArray(record.missingInformation)) {
    record.missingInformation = []
  }

  return record
}

function parseModelJson(text) {
  const withoutFence = text
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/, '')

  return JSON.parse(withoutFence)
}

export async function analyzePublicIssue(text) {
  const apiKey = readApiKey()
  if (!apiKey || apiKey === 'YOUR_ACTUAL_KEY') {
    const error = new Error('AI service is not configured yet.')
    error.code = 'NOT_CONFIGURED'
    throw error
  }

  const ai = new GoogleGenAI({ apiKey })
  let response
  let lastError

  for (const model of MODELS) {
    try {
      response = await ai.models.generateContent({
        model,
        contents: text,
        config: {
          systemInstruction,
          temperature: 0.2,
          responseMimeType: 'application/json',
          responseJsonSchema,
        },
      })
      lastError = null
      break
    } catch (error) {
      lastError = error
      if (!shouldTryNextModel(error)) break
    }
  }

  if (!response) {
    const failure = new Error('Gemini request failed')
    failure.code = 'AI_FAILED'
    failure.cause = lastError
    throw failure
  }

  let parsed
  try {
    parsed = normalizeModelJson(parseModelJson(response.text || ''))
  } catch (error) {
    const failure = new Error('Gemini returned invalid JSON')
    failure.code = 'AI_FAILED'
    failure.cause = error
    throw failure
  }

  const validated = analysisSchema.safeParse(parsed)
  if (!validated.success) {
    const failure = new Error('Gemini JSON failed validation')
    failure.code = 'AI_FAILED'
    failure.cause = validated.error
    throw failure
  }

  const result = validated.data
  if (result.missingInformation.length > 1) {
    result.missingInformation = [result.missingInformation[0]]
  }

  return result
}
