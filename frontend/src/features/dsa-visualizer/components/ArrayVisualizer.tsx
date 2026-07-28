import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ArrayVisualizerProps {
  array: (number | string)[]
  highlights?: { indices: number[]; color: string }[]
  pointers?: { index: number; label: string; color: string }[]
  swaps?: { from: number; to: number }
  className?: string
}

const colorMap: Record<string, string> = {
  blue: '#3B82F6',
  green: '#22C55E',
  yellow: '#EAB308',
  orange: '#F97316',
  red: '#EF4444',
  gray: '#6B7280',
}

function resolveColor(c: string): string {
  return colorMap[c] ?? c
}

const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({
  array,
  highlights,
  pointers,
  swaps,
  className,
}) => {
  const getHighlight = (idx: number): string | undefined => {
    if (!highlights) return undefined
    for (const h of highlights) {
      if (h.indices.includes(idx)) return resolveColor(h.color)
    }
    return undefined
  }

  const isSwapping = (idx: number): boolean => {
    if (!swaps) return false
    return idx === swaps.from || idx === swaps.to
  }

  return (
    <div
      className={className}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
    >
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', gap: 4, height: 80 }}>
        {pointers?.map((p) => (
          <motion.div
            key={p.label}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              left: `calc(${p.index * 56}px + 28px)`,
              transform: 'translateX(-50%)',
              top: -4,
              fontSize: 12,
              fontWeight: 700,
              color: resolveColor(p.color),
              whiteSpace: 'nowrap',
            }}
          >
            {p.label}
            <svg width="10" height="10" viewBox="0 0 10 10" style={{ display: 'block', margin: '0 auto' }}>
              <path d="M5 10 L0 0 L10 0 Z" fill={resolveColor(p.color)} />
            </svg>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <AnimatePresence mode="popLayout">
          {array.map((val, idx) => {
            const highlightColor = getHighlight(idx)
            const swapping = isSwapping(idx)
            const isEmpty = val === '' || val === undefined || val === null

            return (
              <motion.div
                key={`${idx}-${val}`}
                layout
                initial={
                  swapping
                    ? { opacity: 0, x: 0 }
                    : { opacity: 0, scale: 0.8 }
                }
                animate={
                  swapping
                    ? { opacity: 1, x: swaps?.from === idx ? (swaps.to - swaps.from) * 56 : (swaps.from - swaps.to) * 56 }
                    : { opacity: 1, scale: 1 }
                }
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                style={{
                  width: 48,
                  height: 48,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 6,
                  border: isEmpty ? '2px dashed #9CA3AF' : highlightColor ? `2px solid ${highlightColor}` : '2px solid #D1D5DB',
                  backgroundColor: highlightColor ? highlightColor + '20' : '#FFFFFF',
                  color: highlightColor || '#1F2937',
                  fontWeight: 600,
                  fontSize: 14,
                  position: 'relative',
                  transition: 'background-color 0.3s, border-color 0.3s',
                  boxShadow: swapping ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                }}
              >
                {isEmpty ? '' : String(val)}
                <span
                  style={{
                    position: 'absolute',
                    bottom: -18,
                    fontSize: 10,
                    color: '#9CA3AF',
                    fontWeight: 400,
                  }}
                >
                  {idx}
                </span>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ArrayVisualizer
