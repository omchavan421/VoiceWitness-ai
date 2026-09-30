import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Button from '../components/Button'
import StatusTimeline from '../components/StatusTimeline'
import { getReportById } from '../data/mockReports'

export default function ReportDetails() {
  const { id } = useParams()
  const report = getReportById(id)

  useEffect(() => {
    document.title = report
      ? `${report.id} · VoiceWitness AI`
      : 'Report not found · VoiceWitness AI'
  }, [report])

  if (!report) {
    return (
      <section className="page narrow">
        <h1>Report not found</h1>
        <p className="lede">There is no sample report with ID {id}.</p>
        <Button to="/my-reports" variant="secondary">
          Back
        </Button>
      </section>
    )
  }

  return (
    <section className="page narrow">
      <Button to="/my-reports" variant="secondary">
        Back
      </Button>
      <p className="eyebrow">Case</p>
      <h1>{report.issue}</h1>
      <div className="card">
        <dl className="facts">
          <dt>Report ID</dt>
          <dd className="report-id">{report.id}</dd>
          <dt>Issue</dt>
          <dd>{report.issue}</dd>
          <dt>Category</dt>
          <dd>{report.category}</dd>
          <dt>Location</dt>
          <dd>{report.location}</dd>
          <dt>Urgency</dt>
          <dd>
            <span className={`badge badge-${report.urgency.toLowerCase()}`}>
              {report.urgency}
            </span>
          </dd>
          <dt>Recommended Authority</dt>
          <dd>{report.authority}</dd>
          <dt>Description</dt>
          <dd>{report.description}</dd>
        </dl>
      </div>
      <div className="card">
        <h2>Status</h2>
        <StatusTimeline steps={report.timeline} />
      </div>
    </section>
  )
}
