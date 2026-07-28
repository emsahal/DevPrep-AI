import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface StackVisualizerProps {
  items: (string | number)[]
  topIndex?: number
  highlights?: number[]
  className?: string
}

const StackVisualizer: React.FC<StackVisualizerProps> = ({
  items,
  topIndex,
  highlights,
  className,
}) => {
  return (
    <div
      className={className}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column-reverse',
          alignItems: 'center',
          gap: 4,
          border: '2px solid #E5E7EB',
          borderRadius: 8,
          padding: 12,
          minWidth: 80,
          minHeight: 200,
          background: '#FAFAFA',
        }}
      >
        <AnimatePresence mode="popLayout">
          {items.map((val, idx) => {
            const isTop = topIndex !== undefined ? idx === topIndex : idx === items.length - 1
            const isHighlighted = highlights?.includes(idx)

            return (
              <motion.div
                key={`${idx}-${val}`}
                layout
                initial={{ opacity: 0, y: -60, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  boxShadow: isHighlighted
                    ? '0 0 12px 3px rgba(59,130,246,0.4)'
                    : '0 1px 3px rgba(0,0,0,0.1)',
                }}
                exit={{ opacity: 0, y: -40, scale: 0.8 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                style={{
                  width: 64,
                  padding: '10px 0',
                  textAlign: 'center',
                  borderRadius: 6,
                  border: `2px solid ${isTop ? '#3B82F6' : isHighlighted ? '#22C55E' : '#D1D5DB'}`,
                  backgroundColor: isTop ? '#EFF6FF' : isHighlighted ? '#F0FDF4' : '#FFFFFF',
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#1F2937',
                  position: 'relative',
                }}
              >
                {String(val)}
                {isTop && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -22,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#3B82F6',
                      background: '#EFF6FF',
                      padding: '1px 8px',
                      borderRadius: 4,
                      border: '1px solid #93C5FD',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Top
                  </span>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {items.length === 0 && (
        <div style={{ color: '#9CA3AF', fontSize: 13, fontStyle: 'italic' }}>Empty stack</div>
      )}
    </div>
  )
}

export default StackVisualizer
