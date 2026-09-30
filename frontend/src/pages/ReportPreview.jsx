import { useEffect } from 'react'
import Button from '../components/Button'
import { previewReport } from '../data/mockReports'

export default function ReportPreview() {
  useEffect(() => {
    document.title = 'Your Report Is Ready · VoiceWitness AI'
  }, [])

  return (
    <section className="page narrow">
      <p className="eyebrow">Review before sending</p>
      <h1>Your Report Is Ready</h1>
      <p className="lede">
        Check the sample report. Submit does not save it yet. It opens My Reports.
      </p>

      <article className="report-sheet">
        <header>Public Issue Report</header>
        <div className="report-body">
          <dl className="facts">
            <dt>Issue</dt>
            <dd>{previewReport.issue}</dd>
            <dt>Category</dt>
            <dd>{previewReport.category}</dd>
            <dt>Location</dt>
            <dd>{previewReport.location}</dd>
            <dt>Risk</dt>
            <dd>
              <span className="badge badge-high">{previewReport.risk}</span>
            </dd>
            <dt>Recommended Authority</dt>
            <dd>{previewReport.authority}</dd>
            <dt>Description</dt>
            <dd>{previewReport.description}</dd>
            <dt>Evidence</dt>
            <dd>{previewReport.evidence}</dd>
            <dt>Status</dt>
            <dd>{previewReport.status}</dd>
          </dl>
        </div>
      </article>

      <div className="actions">
        <Button to="/report" variant="secondary">
          Edit Report
        </Button>
        <Button to="/my-reports">Submit Report</Button>
      </div>
    </section>
  )
}
