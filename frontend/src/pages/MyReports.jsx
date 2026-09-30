import { useEffect } from 'react'
import IssueCard from '../components/IssueCard'
import { reports } from '../data/mockReports'

export default function MyReports() {
  useEffect(() => {
    document.title = 'My Reports · VoiceWitness AI'
  }, [])

  return (
    <section className="page">
      <p className="eyebrow">Track</p>
      <h1>My Reports</h1>
      <p className="lede">
        These are sample cases so you can see how tracking will look. They are not saved in a database.
      </p>
      <div className="report-grid">
        {reports.map((report) => (
          <IssueCard key={report.id} report={report} />
        ))}
      </div>
    </section>
  )
}
