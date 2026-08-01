import { useEffect, useRef, useState, type ReactNode } from 'react'

interface AnimateOnScrollProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'fade'
}

export function AnimateOnScroll({ children, className = '', delay = 0, direction = 'up' }: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting)
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const getInitialTransform = () => {
    switch (direction) {
      case 'left':
        return 'translateX(-50px)'
      case 'right':
        return 'translateX(50px)'
      case 'fade':
        return 'none'
      case 'up':
      default:
        return 'translateY(40px)'
    }
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? (direction === 'fade' ? 'none' : 'translate(0, 0)') : getInitialTransform(),
        transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)${delay ? ` ${delay}ms` : ''}, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)${delay ? ` ${delay}ms` : ''}`,
      }}
    >
      {children}
    </div>
  )
}


