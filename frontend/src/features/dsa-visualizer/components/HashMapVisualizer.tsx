import React from 'react'
import { motion } from 'framer-motion'

interface HashMapEntry {
  key: string | number
  value: string | number
  hash?: number
  highlighted?: boolean
}

interface HashMapVisualizerProps {
  entries: HashMapEntry[]
  buckets?: number
  className?: string
}

const HashMapVisualizer: React.FC<HashMapVisualizerProps> = ({
  entries,
  buckets = 10,
  className,
}) => {
  const bucketEntries: HashMapEntry[][] = Array.from({ length: buckets }, () => [])

  for (const entry of entries) {
    const hash = entry.hash ?? hashSimple(String(entry.key), buckets)
    bucketEntries[hash].push(entry)
  }

  return (
    <div
      className={className}
      style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(buckets, 5)}, 1fr)`,
          gap: 8,
          width: '100%',
        }}
      >
        {bucketEntries.map((bucket, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            style={{
              border: '2px solid #E5E7EB',
              borderRadius: 8,
              padding: 8,
              minHeight: 80,
              background: '#FAFAFA',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#6B7280',
                textAlign: 'center',
                borderBottom: '1px solid #E5E7EB',
                paddingBottom: 4,
                marginBottom: 4,
              }}
            >
              [{idx}]
            </div>
            {bucket.length === 0 && (
              <div
                style={{
                  fontSize: 10,
                  color: '#D1D5DB',
                  textAlign: 'center',
                  fontStyle: 'italic',
                }}
              >
                empty
              </div>
            )}
            {bucket.map((entry, eIdx) => (
              <motion.div
                key={`${entry.key}-${eIdx}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  boxShadow: entry.highlighted
                    ? '0 0 10px 2px rgba(59,130,246,0.4)'
                    : '0 1px 2px rgba(0,0,0,0.06)',
                }}
                transition={{ duration: 0.25, delay: eIdx * 0.05 }}
                style={{
                  padding: '4px 6px',
                  borderRadius: 4,
                  border: `1px solid ${entry.highlighted ? '#3B82F6' : '#E5E7EB'}`,
                  backgroundColor: entry.highlighted ? '#EFF6FF' : '#FFFFFF',
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#1F2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span style={{ fontWeight: 700 }}>
                  {String(entry.key)}
                </span>
                <span style={{ color: '#9CA3AF' }}>→</span>
                <span>{String(entry.value)}</span>
                {entry.hash !== undefined && (
                  <span style={{ fontSize: 9, color: '#9CA3AF', marginLeft: 'auto' }}>
                    h={entry.hash}
                  </span>
                )}
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function hashSimple(key: string, mod: number): number {
  let h = 0
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) | 0
  }
  return ((h % mod) + mod) % mod
}

export default HashMapVisualizer
