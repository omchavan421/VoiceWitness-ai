import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Button from './components/Button'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Analysis from './pages/Analysis'
import Home from './pages/Home'
import MyReports from './pages/MyReports'
import ReportDetails from './pages/ReportDetails'
import ReportIssue from './pages/ReportIssue'
import ReportPreview from './pages/ReportPreview'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function NotFound() {
  return (
    <section className="page narrow">
      <h1>Page not found</h1>
      <p className="lede">That address is not part of VoiceWitness AI.</p>
      <Button to="/">Back to Home</Button>
    </section>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app-shell">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<ReportIssue />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/report-preview" element={<ReportPreview />} />
            <Route path="/my-reports" element={<MyReports />} />
            <Route path="/reports/:id" element={<ReportDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
