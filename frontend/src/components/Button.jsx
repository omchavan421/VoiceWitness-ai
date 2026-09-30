import { Link } from 'react-router-dom'

export default function Button({
  children,
  to,
  state,
  onClick,
  variant = 'primary',
  type = 'button',
}) {
  const className = `btn btn-${variant}`

  if (to) {
    return (
      <Link to={to} state={state} className={className}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={className} onClick={onClick}>
      {children}
    </button>
  )
}
