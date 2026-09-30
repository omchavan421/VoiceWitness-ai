// Sample reports for the Phase 2 screens.
// Later phases will replace this file with saved reports from the database.

export const reports = [
  {
    id: 'VW1024',
    issue: 'Dangerous pothole',
    category: 'Road Safety',
    location: 'Near college main gate',
    urgency: 'High',
    authority: 'Municipal / Road Department',
    description:
      'A large pothole is present near the college main gate and may create a safety risk for pedestrians and two-wheelers.',
    evidence: 'Photo recommended',
    status: 'Under Review',
    timeline: [
      { label: 'Report Submitted', state: 'done' },
      { label: 'Assigned to Authority', state: 'done' },
      { label: 'Under Review', state: 'current' },
      { label: 'Resolved', state: 'upcoming' },
    ],
  },
  {
    id: 'VW1025',
    issue: 'Broken streetlight',
    category: 'Public Infrastructure',
    location: 'Near residential road',
    urgency: 'Medium',
    authority: 'Municipal / Local Authority',
    description:
      'A streetlight near the residential road has stayed off, leaving the stretch dark for people walking after sunset.',
    evidence: 'Photo recommended if it can be taken safely',
    status: 'Submitted',
    timeline: [
      { label: 'Report Submitted', state: 'current' },
      { label: 'Assigned to Authority', state: 'upcoming' },
      { label: 'Under Review', state: 'upcoming' },
      { label: 'Resolved', state: 'upcoming' },
    ],
  },
]

export function getReportById(id) {
  return reports.find((report) => report.id === id)
}

export const sampleAnalysis = {
  issue: 'Dangerous pothole',
  category: 'Road Safety',
  location: 'Near college main gate',
  urgency: 'High',
  authority: 'Municipal / Road Department',
  evidence: 'Photo recommended',
  checks: [
    'What happened',
    'Where it happened',
    'How urgent it is',
    'Who should handle it',
    'What information may be missing',
  ],
}

export const previewReport = {
  issue: 'Dangerous pothole',
  category: 'Road Safety',
  location: 'Near college main gate',
  risk: 'High',
  authority: 'Municipal / Road Department',
  description:
    'A large pothole is present near the college main gate and may create a safety risk for pedestrians and two-wheelers.',
  evidence: 'Photo recommended',
  status: 'Draft',
}
