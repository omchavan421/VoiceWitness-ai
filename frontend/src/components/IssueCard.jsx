import Button from './Button'

export default function IssueCard({ report }) {
  return (
    <article className="card issue-card">
      <p className="report-id">{report.id}</p>
      <h2>{report.issue}</h2>
      <p className="muted">{report.location}</p>
      <p>
        <span className={`badge badge-${report.urgency.toLowerCase()}`}>
          {report.urgency} urgency
        </span>
      </p>
      <p className="status-line">
        Status: <strong>{report.status}</strong>
      </p>
      <Button to={`/reports/${report.id}`}>View Details</Button>
    </article>
  )
}
