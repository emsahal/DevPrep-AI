import React from 'react'
import { motion } from 'framer-motion'

interface LinkedListVisualizerProps {
  nodes: { value: string | number; id: string; highlighted?: boolean; color?: string }[]
  arrows?: { from: string; to: string; label?: string; color?: string }[]
  headId?: string
  className?: string
}

const LinkedListVisualizer: React.FC<LinkedListVisualizerProps> = ({
  nodes,
  arrows,
  headId,
  className,
}) => {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]))

  return (
    <div
      className={className}
      style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '24px 8px 8px', flexWrap: 'wrap' }}
    >
      {nodes.map((node, idx) => {
        const outArrow = arrows?.find((a) => a.from === node.id)
        const nextNode = outArrow ? nodeMap.get(outArrow.to) : null

        return (
          <React.Fragment key={node.id}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              {node.id === headId && (
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: 'absolute',
                    top: -24,
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#EF4444',
                    background: '#FEF2F2',
                    padding: '2px 8px',
                    borderRadius: 4,
                    border: '1px solid #FCA5A5',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Head
                </motion.span>
              )}

              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  boxShadow: node.highlighted
                    ? '0 0 16px 4px rgba(59,130,246,0.5)'
                    : '0 1px 3px rgba(0,0,0,0.12)',
                }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                style={{
                  padding: '10px 18px',
                  borderRadius: 10,
                  border: `2px solid ${node.color ?? '#3B82F6'}`,
                  backgroundColor: node.highlighted ? '#EFF6FF' : '#FFFFFF',
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#1F2937',
                  minWidth: 36,
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                {String(node.value)}
              </motion.div>

              {outArrow && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  style={{
                    fontSize: 20,
                    color: outArrow.color ?? '#9CA3AF',
                    margin: '0 4px',
                    lineHeight: 1,
                  }}
                >
                  →
                </motion.span>
              )}

              {outArrow?.label && (
                <span
                  style={{
                    position: 'absolute',
                    top: -10,
                    right: -24,
                    fontSize: 10,
                    color: outArrow.color ?? '#6B7280',
                    fontWeight: 600,
                  }}
                >
                  {outArrow.label}
                </span>
              )}
            </div>

            {!outArrow && idx < nodes.length - 1 && (
              <span style={{ fontSize: 20, color: '#D1D5DB', margin: '0 4px' }}>→</span>
            )}

            {nextNode === null || nextNode === undefined ? (
              idx === nodes.length - 1 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    width: 36,
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    border: '2px dashed #EF4444',
                    color: '#EF4444',
                    fontWeight: 700,
                    fontSize: 16,
                    marginLeft: 4,
                  }}
                >
                  X
                </motion.div>
              ) : null
            ) : null}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default LinkedListVisualizer
