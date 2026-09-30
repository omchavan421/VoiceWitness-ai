const markByState = {
  done: '✓',
  current: '●',
  upcoming: '○',
}

const meaningByState = {
  done: 'Completed',
  current: 'Current step',
  upcoming: 'Not yet',
}

export default function StatusTimeline({ steps }) {
  return (
    <ol className="timeline">
      {steps.map((step) => (
        <li key={step.label} className={`timeline-step timeline-${step.state}`}>
          <span className="timeline-mark" aria-hidden="true">
            {markByState[step.state]}
          </span>
          <span>
            <span className="visually-hidden">{meaningByState[step.state]}: </span>
            {step.label}
          </span>
        </li>
      ))}
    </ol>
  )
}
