import { useNavigate, Link } from 'react-router-dom'

interface BackButtonProps {
  to?: string
  label?: string
  className?: string
}

export function BackButton({ to, label = 'Back', className = '' }: BackButtonProps) {
  const navigate = useNavigate()

  const content = (
    <>
      <span className="material-symbols-outlined text-[16px] transition-transform group-hover:-translate-x-0.5">
        arrow_back
      </span>
      <span>{label}</span>
    </>
  )

  const baseStyle = "inline-flex items-center gap-1.5 text-xs font-semibold hover:underline group cursor-pointer"
  const colorStyle = { color: 'var(--color-primary)' }

  if (to) {
    return (
      <Link to={to} className={`${baseStyle} ${className}`} style={colorStyle}>
        {content}
      </Link>
    )
  }

  return (
    <button
      onClick={() => navigate(-1)}
      type="button"
      className={`${baseStyle} bg-transparent border-none p-0 outline-none ${className}`}
      style={colorStyle}
    >
      {content}
    </button>
  )
}
