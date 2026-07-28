import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface QueueVisualizerProps {
  items: (string | number)[]
  frontIndex?: number
  rearIndex?: number
  highlights?: number[]
  className?: string
}

const QueueVisualizer: React.FC<QueueVisualizerProps> = ({
  items,
  frontIndex,
  rearIndex,
  highlights,
  className,
}) => {
  const showFront = frontIndex !== undefined
  const showRear = rearIndex !== undefined

  return (
    <div
      className={className}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
    >
      <div style={{ display: 'flex', gap: 4, alignItems: 'flex-start', minHeight: 100, paddingTop: 24 }}>
        <AnimatePresence mode="popLayout">
          {items.map((val, idx) => {
            const isFront = showFront && idx === frontIndex
            const isRear = showRear && idx === rearIndex
            const isHighlighted = highlights?.includes(idx)

            return (
              <motion.div
                key={`${idx}-${val}`}
                layout
                initial={{ opacity: 0, x: 60, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  boxShadow: isHighlighted
                    ? '0 0 12px 3px rgba(59,130,246,0.4)'
                    : '0 1px 3px rgba(0,0,0,0.1)',
                }}
                exit={{ opacity: 0, x: -60, scale: 0.8 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                style={{
                  width: 56,
                  padding: '12px 0',
                  textAlign: 'center',
                  borderRadius: 6,
                  border: `2px solid ${
                    isFront ? '#22C55E' : isRear ? '#3B82F6' : isHighlighted ? '#EAB308' : '#D1D5DB'
                  }`,
                  backgroundColor: isFront ? '#F0FDF4' : isRear ? '#EFF6FF' : '#FFFFFF',
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#1F2937',
                  position: 'relative',
                }}
              >
                {String(val)}

                {isFront && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      position: 'absolute',
                      bottom: -28,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 0,
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10">
                      <path d="M5 0 L0 10 L10 10 Z" fill="#22C55E" />
                    </svg>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#22C55E', whiteSpace: 'nowrap' }}>
                      Front
                    </span>
                  </motion.div>
                )}

                {isRear && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      position: 'absolute',
                      top: -28,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 0,
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10">
                      <path d="M5 10 L0 0 L10 0 Z" fill="#3B82F6" />
                    </svg>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#3B82F6', whiteSpace: 'nowrap' }}>
                      Rear
                    </span>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {items.length === 0 && (
        <div style={{ color: '#9CA3AF', fontSize: 13, fontStyle: 'italic' }}>Empty queue</div>
      )}
    </div>
  )
}

export default QueueVisualizer
