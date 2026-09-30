import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/Button'

export default function ReportIssue() {
  const navigate = useNavigate()
  const location = useLocation()
  const textRef = useRef(null)
  const [description, setDescription] = useState('')
  const [voiceNote, setVoiceNote] = useState('')

  useEffect(() => {
    document.title = 'Report a Public Issue · VoiceWitness AI'
  }, [])

  useEffect(() => {
    if (location.state?.focusText) {
      textRef.current?.focus()
    }
  }, [location.state])

  function showVoicePlaceholder() {
    setVoiceNote(
      'Voice input is not connected yet. Type what you saw in the box below.',
    )
  }

  function analyzeIssue() {
    navigate('/analysis')
  }

  function clearReport() {
    setDescription('')
    setVoiceNote('')
    textRef.current?.focus()
  }

  return (
    <section className="page narrow">
      <p className="eyebrow">New report</p>
      <h1>Report a Public Issue</h1>
      <p className="lede">Tell us what you witnessed.</p>

      <div className="card voice-card">
        <button type="button" className="mic-button" onClick={showVoicePlaceholder}>
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
          <span>Start Speaking</span>
        </button>
        <p className="voice-note" role="status">
          {voiceNote || 'Microphone access is off for now. This button is a placeholder.'}
        </p>
        <p className="or-type">Or type what you saw</p>
        <label className="field-label" htmlFor="witness-text">
          What you witnessed
        </label>
        <textarea
          id="witness-text"
          ref={textRef}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Example: There is a large pothole near my college gate and bikes are almost falling."
          rows={6}
        />
        <div className="actions">
          <Button onClick={analyzeIssue}>Analyze Issue</Button>
          <Button variant="secondary" onClick={clearReport}>
            Clear
          </Button>
        </div>
        <p className="hint">
          Analyze Issue opens a sample analysis. Your text is not sent to an AI yet.
        </p>
      </div>
    </section>
  )
}
