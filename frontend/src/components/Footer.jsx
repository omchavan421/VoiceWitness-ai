import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <p className="footer-brand">VoiceWitness AI</p>
          <p>See a Problem. Speak It. Route It.</p>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <Link to="/">Home</Link>
          <Link to="/report">Report Issue</Link>
          <Link to="/my-reports">My Reports</Link>
        </nav>
        <p className="footer-note">
          Your safety comes first. Never approach dangerous objects just to collect evidence.
          Sample reports on this screen are not sent to an authority.
        </p>
      </div>
    </footer>
  )
}
