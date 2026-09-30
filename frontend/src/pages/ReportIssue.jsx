import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/Button'

const DRAFT_KEY = 'voicewitness-draft-text'

const LANGUAGES = [
  { code: 'en-IN', label: 'English' },
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'mr-IN', label: 'Marathi' },
]

function getSpeechRecognitionConstructor() {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition || window.webkitSpeechRecognition || null
}

function readDraft() {
  try {
    return sessionStorage.getItem(DRAFT_KEY) || ''
  } catch {
    return ''
  }
}

function saveDraft(text) {
  try {
    if (text) sessionStorage.setItem(DRAFT_KEY, text)
    else sessionStorage.removeItem(DRAFT_KEY)
  } catch {
    // Private browsing can block storage. The text still stays on the page.
  }
}

// Add newly spoken words without erasing anything the user already typed.
function appendTranscript(currentText, spokenText) {
  const spoken = spokenText.trim()
  if (!spoken) return currentText
  if (!currentText) return spoken
  if (/\s$/.test(currentText)) return `${currentText}${spoken}`
  return `${currentText} ${spoken}`
}

export default function ReportIssue() {
  const navigate = useNavigate()
  const location = useLocation()
  const textRef = useRef(null)
  const recognitionRef = useRef(null)
  const shouldListenRef = useRef(false)
  const finalCountRef = useRef(0)
  const descriptionRef = useRef('')
  const interimRef = useRef('')

  const speechSupported = Boolean(getSpeechRecognitionConstructor())
  const [description, setDescription] = useState(
    () => location.state?.description || readDraft(),
  )
  const [interimText, setInterimText] = useState('')
  const [language, setLanguage] = useState('en-IN')
  const [status, setStatus] = useState(speechSupported ? 'idle' : 'unsupported')
  const [notice, setNotice] = useState('')
  const [validation, setValidation] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const analyzingRef = useRef(false)

  useEffect(() => {
    document.title = 'Report a Public Issue · VoiceWitness AI'
  }, [])

  useEffect(() => {
    descriptionRef.current = description
    saveDraft(description)
  }, [description])

  useEffect(() => {
    if (location.state?.focusText) {
      textRef.current?.focus()
    }
  }, [location.state])

  useEffect(() => {
    const SpeechRecognitionApi = getSpeechRecognitionConstructor()
    if (!SpeechRecognitionApi) return undefined

    const recognition = new SpeechRecognitionApi()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-IN'
    recognitionRef.current = recognition

    recognition.onresult = (event) => {
      let spokenNow = ''
      let interim = ''

      // Copy each finished phrase once. Stop at the first phrase that is still interim
      // so a later event can add it without repeating earlier words.
      for (let index = finalCountRef.current; index < event.results.length; index += 1) {
        const result = event.results[index]
        const transcript = result[0]?.transcript || ''
        if (!result.isFinal) {
          interim = appendTranscript(interim, transcript)
          break
        }
        spokenNow = appendTranscript(spokenNow, transcript)
        finalCountRef.current = index + 1
      }

      if (spokenNow) {
        setDescription((current) => {
          const next = appendTranscript(current, spokenNow)
          descriptionRef.current = next
          return next
        })
        setValidation('')
      }
      interimRef.current = interim
      setInterimText(interim)
    }

    recognition.onerror = (event) => {
      if (event.error === 'aborted') return
      shouldListenRef.current = false
      interimRef.current = ''
      setInterimText('')

      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setStatus('error')
        setNotice('Microphone permission is required. You can also type your issue instead.')
        return
      }

      if (event.error === 'no-speech') {
        setStatus('stopped')
        setNotice('No speech was heard. Try again, or type your issue instead.')
        return
      }

      setStatus('error')
      setNotice('Voice input could not continue. You can type your issue instead.')
    }

    recognition.onend = () => {
      if (shouldListenRef.current && interimRef.current.trim()) {
        const next = appendTranscript(descriptionRef.current, interimRef.current)
        descriptionRef.current = next
        setDescription(next)
      }
      interimRef.current = ''
      setInterimText('')
      if (shouldListenRef.current) {
        shouldListenRef.current = false
        setStatus('stopped')
        setNotice('Listening stopped unexpectedly. You can start again or type your issue.')
        return
      }
      setStatus((current) => (current === 'listening' ? 'stopped' : current))
    }

    return () => {
      shouldListenRef.current = false
      recognition.onresult = null
      recognition.onerror = null
      recognition.onend = null
      recognitionRef.current = null
      try {
        recognition.stop()
      } catch {
        // stop() throws if recognition was never started.
      }
    }
  }, [])

  function updateDescription(nextValue) {
    descriptionRef.current = nextValue
    setDescription(nextValue)
    if (nextValue.trim()) setValidation('')
  }

  function startListening() {
    const recognition = recognitionRef.current
    if (!recognition) return

    setNotice('')
    setValidation('')
    interimRef.current = ''
    setInterimText('')
    finalCountRef.current = 0
    recognition.lang = language
    shouldListenRef.current = true

    try {
      recognition.start()
      setStatus('listening')
    } catch {
      shouldListenRef.current = false
      setStatus('error')
      setNotice('Voice input could not start. You can type your issue instead.')
    }
  }

  function stopListening() {
    const pendingSpeech = interimRef.current.trim()
    if (pendingSpeech) {
      const next = appendTranscript(descriptionRef.current, pendingSpeech)
      descriptionRef.current = next
      setDescription(next)
    }

    shouldListenRef.current = false
    interimRef.current = ''
    setInterimText('')
    try {
      recognitionRef.current?.stop()
    } catch {
      // Already stopped.
    }
    setStatus(speechSupported ? 'stopped' : 'unsupported')
    if (!descriptionRef.current.trim()) {
      setNotice('No speech was heard. Try again, or type your issue instead.')
    }
  }

  function handleMicrophoneClick() {
    if (status === 'listening') {
      stopListening()
      return
    }
    startListening()
  }

  function handleLanguageChange(event) {
    const nextLanguage = event.target.value
    setLanguage(nextLanguage)
    if (status !== 'listening') return
    stopListening()
    setNotice('Language updated. Click Start Speaking to listen again.')
  }

  async function analyzeIssue() {
    const text = description.trim()
    if (!text) {
      setValidation('Please describe the issue before continuing.')
      textRef.current?.focus()
      return
    }
    if (analyzingRef.current) return

    if (status === 'listening') stopListening()
    analyzingRef.current = true
    setIsAnalyzing(true)
    setValidation('')

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const body = await response.json().catch(() => null)

      if (!response.ok || !body?.success || !body.data) {
        if (body?.error === 'AI service is not configured yet.') {
          setValidation('AI service is not configured yet.')
        } else if (response.status === 400) {
          setValidation('Please provide a valid issue description.')
        } else {
          setValidation("We couldn't analyze your report right now. Please try again.")
        }
        return
      }

      navigate('/analysis', { state: { description: text, analysis: body.data } })
    } catch {
      setValidation("We couldn't analyze your report right now. Please try again.")
    } finally {
      analyzingRef.current = false
      setIsAnalyzing(false)
    }
  }

  function clearReport() {
    shouldListenRef.current = false
    try {
      recognitionRef.current?.stop()
    } catch {
      // Already stopped.
    }
    finalCountRef.current = 0
    descriptionRef.current = ''
    interimRef.current = ''
    setDescription('')
    setInterimText('')
    setNotice('')
    setValidation('')
    setStatus(speechSupported ? 'idle' : 'unsupported')
    saveDraft('')
    textRef.current?.focus()
  }

  const listening = status === 'listening'
  const microphoneLabel = listening ? 'Listening…' : 'Start Speaking'
  let statusMessage = 'Click Start Speaking, or type what you saw.'
  if (status === 'unsupported') {
    statusMessage = 'This browser does not support speech recognition. Please type your issue instead.'
  } else if (notice) {
    statusMessage = notice
  } else if (listening) {
    statusMessage = 'Listening… Speak naturally, then click Stop.'
  }

  return (
    <section className="page narrow">
      <p className="eyebrow">New report</p>
      <h1>Report a Public Issue</h1>
      <p className="lede">Tell us what you witnessed.</p>

      <div className="card voice-card">
        <label className="field-label" htmlFor="speech-language">
          Speech language
        </label>
        <select
          id="speech-language"
          className="language-select"
          value={language}
          onChange={handleLanguageChange}
          disabled={!speechSupported}
        >
          {LANGUAGES.map((item) => (
            <option key={item.code} value={item.code}>
              {item.label}
            </option>
          ))}
        </select>
        <p className="hint language-hint">
          English uses en-IN, Hindi uses hi-IN, and Marathi uses mr-IN. A browser may not
          recognize every language.
        </p>

        <button
          type="button"
          className={listening ? 'mic-button listening' : 'mic-button'}
          onClick={handleMicrophoneClick}
          disabled={!speechSupported}
          aria-label={listening ? 'Stop voice recording' : 'Start voice recording'}
          aria-pressed={listening}
        >
          {listening ? (
            <span className="live-dot" aria-hidden="true" />
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" />
              <path
                d="M6 11 a6 6 0 0 0 12 0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path d="M12 17 V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M8 21 H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
          <span>{microphoneLabel}</span>
        </button>

        {listening ? (
          <Button variant="secondary" onClick={stopListening}>
            Stop
          </Button>
        ) : null}

        <p className="voice-note" role="status">
          {statusMessage}
        </p>
        {interimText ? (
          <p className="interim" aria-live="polite">
            Hearing: {interimText}
          </p>
        ) : null}

        <p className="or-type">Or type what you saw</p>
        <label className="field-label" htmlFor="witness-text">
          What you witnessed
        </label>
        <textarea
          id="witness-text"
          ref={textRef}
          value={description}
          onChange={(event) => updateDescription(event.target.value)}
          placeholder="Example: There is a large pothole near my college gate and bikes are almost falling."
          rows={6}
          aria-invalid={validation ? 'true' : 'false'}
          aria-describedby={validation ? 'report-validation' : undefined}
        />
        {validation ? (
          <p id="report-validation" className="form-alert" role="alert">
            {validation}
          </p>
        ) : null}
        {isAnalyzing ? (
          <p className="voice-note" role="status">
            Understanding your report...
          </p>
        ) : null}
        <div className="actions">
          <Button onClick={analyzeIssue} disabled={isAnalyzing}>
            {isAnalyzing ? 'Understanding your report...' : 'Analyze Issue'}
          </Button>
          <Button variant="secondary" onClick={clearReport} disabled={isAnalyzing}>
            Clear
          </Button>
        </div>
        <p className="hint">
          Analyze Issue sends your description to the VoiceWitness server. The AI key stays there.
        </p>
      </div>
    </section>
  )
}
