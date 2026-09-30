import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Button from '../components/Button'

function hasAnalysis(value) {
  return Boolean(
    value &&
      typeof value.issue === 'string' &&
      typeof value.category === 'string' &&
      typeof value.urgency === 'string',
  )
}

export default function Analysis() {
  const location = useLocation()
  const analysis = hasAnalysis(location.state?.analysis) ? location.state.analysis : null
  const needsMore = Boolean(
    analysis &&
      (analysis.followUpQuestion ||
        (Array.isArray(analysis.missingInformation) && analysis.missingInformation.length > 0)),
  )

  useEffect(() => {
    document.title = analysis
      ? `${analysis.issue} · VoiceWitness AI`
      : 'Understanding Your Report · VoiceWitness AI'
  }, [analysis])

  if (!analysis) {
    return (
      <section className="page narrow">
        <p className="eyebrow">Analysis</p>
        <h1>No analysis yet</h1>
        <p className="lede">
          Describe a public issue first. VoiceWitness sends that description to the server
          and shows the structured result here.
        </p>
        <Button to="/report">Report an issue</Button>
      </section>
    )
  }

  const urgency = String(analysis.urgency).toLowerCase()
  const urgencyLabel = urgency.charAt(0).toUpperCase() + urgency.slice(1)

  return (
    <section className="page narrow">
      <p className="eyebrow">AI understanding</p>
      <h1>{analysis.issue}</h1>
      <p className="lede">
        This result comes from your description. It has not been sent to an authority.
      </p>

      {analysis.safetyAdvice ? (
        <aside className="safety-note">
          <h2>Safety first</h2>
          <p>{analysis.safetyAdvice}</p>
        </aside>
      ) : null}

      {needsMore ? (
        <div className="card">
          <h2>More information needed</h2>
          {analysis.followUpQuestion ? <p>{analysis.followUpQuestion}</p> : null}
        </div>
      ) : null}

      <div className="card">
        <h2>Result</h2>
        <dl className="facts">
          <dt>Issue</dt>
          <dd>{analysis.issue}</dd>
          <dt>Category</dt>
          <dd>{analysis.category}</dd>
          <dt>Sub-category</dt>
          <dd>{analysis.subCategory || 'Not specified'}</dd>
          <dt>Location</dt>
          <dd>{analysis.location || 'Not mentioned yet'}</dd>
          <dt>Urgency</dt>
          <dd>
            <span className={`badge badge-${urgency}`}>{urgencyLabel}</span>
          </dd>
          <dt>Recommended Authority</dt>
          <dd>{analysis.authority}</dd>
          <dt>Description</dt>
          <dd>{analysis.description}</dd>
          <dt>Evidence Recommendation</dt>
          <dd>{analysis.evidenceRecommendation || 'None suggested'}</dd>
        </dl>
        <div className="actions">
          <Button to="/report" state={{ description: location.state?.description || '' }} variant="secondary">
            Edit description
          </Button>
        </div>
      </div>
    </section>
  )
}
