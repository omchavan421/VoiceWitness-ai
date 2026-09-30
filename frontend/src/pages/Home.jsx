import { useEffect } from 'react'
import Button from '../components/Button'
import { previewReport } from '../data/mockReports'

const steps = [
  {
    number: '1',
    title: 'Speak',
    text: 'Describe the problem naturally.',
  },
  {
    number: '2',
    title: 'Understand',
    text: 'AI identifies the issue, location, urgency and missing information.',
  },
  {
    number: '3',
    title: 'Route',
    text: 'Get the recommended authority and a structured report.',
  },
  {
    number: '4',
    title: 'Track',
    text: 'Track the status of your submitted report.',
  },
]

export default function Home() {
  useEffect(() => {
    document.title = 'VoiceWitness AI'
  }, [])

  return (
    <>
      <section className="page hero">
        <div>
          <p className="eyebrow">Public issue reporting</p>
          <h1>See a Problem. Speak It. Route It.</h1>
          <p className="lede">
            Report public problems in seconds. Just describe what you see, and AI helps
            understand the issue, assess urgency, identify the right authority, and prepare
            a structured report.
          </p>
          <div className="actions">
            <Button to="/report">Start Speaking</Button>
            <Button to="/report" state={{ focusText: true }} variant="secondary">
              Type Instead
            </Button>
          </div>
        </div>
        <aside className="slip" aria-label="Example structured report">
          <p className="slip-kicker">Example report</p>
          <h2>{previewReport.issue}</h2>
          <dl>
            <div>
              <dt>Category</dt>
              <dd>{previewReport.category}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{previewReport.location}</dd>
            </div>
            <div>
              <dt>Urgency</dt>
              <dd>{previewReport.risk}</dd>
            </div>
            <div>
              <dt>Authority</dt>
              <dd>{previewReport.authority}</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="page section">
        <h2>How VoiceWitness Works</h2>
        <ol className="steps">
          {steps.map((step) => (
            <li key={step.number} className="card step-card">
              <span className="step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="safety">
        <div className="safety-inner">
          <h2>Your safety comes first.</h2>
          <p>Never approach dangerous objects just to collect evidence.</p>
        </div>
      </section>
    </>
  )
}
