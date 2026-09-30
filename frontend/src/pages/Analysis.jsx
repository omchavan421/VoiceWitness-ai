import { useEffect } from 'react'
import Button from '../components/Button'
import { sampleAnalysis } from '../data/mockReports'

export default function Analysis() {
  useEffect(() => {
    document.title = 'Understanding Your Report · VoiceWitness AI'
  }, [])

  return (
    <section className="page narrow">
      <p className="eyebrow">Sample analysis</p>
      <h1>Understanding Your Report…</h1>
      <p className="lede">
        This screen shows a prepared example. Gemini is not connected in this phase.
      </p>

      <div className="meter" aria-hidden="true">
        <span />
      </div>

      <div className="card">
        <p className="check-intro">AI is checking:</p>
        <ul className="checks">
          {sampleAnalysis.checks.map((item) => (
            <li key={item}>
              <span aria-hidden="true">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2>Result</h2>
        <dl className="facts">
          <dt>Issue</dt>
          <dd>{sampleAnalysis.issue}</dd>
          <dt>Category</dt>
          <dd>{sampleAnalysis.category}</dd>
          <dt>Location</dt>
          <dd>{sampleAnalysis.location}</dd>
          <dt>Urgency</dt>
          <dd>
            <span className="badge badge-high">{sampleAnalysis.urgency}</span>
          </dd>
          <dt>Recommended Authority</dt>
          <dd>{sampleAnalysis.authority}</dd>
          <dt>Evidence</dt>
          <dd>{sampleAnalysis.evidence}</dd>
        </dl>
        <div className="actions">
          <Button to="/report-preview">View Report</Button>
        </div>
      </div>
    </section>
  )
}
