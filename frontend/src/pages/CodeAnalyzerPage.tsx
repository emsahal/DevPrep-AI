import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { codeAnalyzerService } from '@/services/codeAnalyzerService'

const DEFAULT_CODE = `function findDuplicates(arr) {
  let seen = new Set();
  let results = [];

  for (let i = 0; i < arr.length; i++) {
    if (seen.has(arr[i])) {
      results.push(arr[i]);
    } else {
      seen.add(arr[i]);
    }
  }
  return results;
}

// Test
console.log(findDuplicates([1, 2, 3, 2, 4, 3]));
// Output: [2, 3]`

export function CodeAnalyzerPage() {
  const [code, setCode] = useState(DEFAULT_CODE)

  const analyzeMutation = useMutation({
    mutationFn: () => codeAnalyzerService.analyze(code),
  })

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0" style={{ borderRight: '1px solid var(--color-border-subtle)', background: 'var(--color-surface-container-lowest)' }}>
        <div className="flex items-center gap-0 h-10 px-0" style={{ borderBottom: '1px solid var(--color-border-subtle)', background: 'var(--color-surface-container-low)' }}>
          <div className="flex items-center gap-2 px-4 h-full border-r text-xs font-medium"
               style={{ borderColor: 'var(--color-border-subtle)', color: 'var(--color-primary)', background: 'var(--color-surface-container-lowest)', borderBottom: '2px solid var(--color-primary)' }}>
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>javascript</span>
            solution.js
            <span className="w-1.5 h-1.5 rounded-full ml-1" style={{ background: 'var(--color-warning)' }} />
          </div>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar font-mono text-sm leading-relaxed" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-on-surface)' }}>
          <div className="flex min-h-full">
            <div className="select-none px-4 py-4 text-right min-w-[3rem] sticky left-0" style={{ color: 'var(--color-border-muted)', borderRight: '1px solid var(--color-border-subtle)', background: 'var(--color-surface-container-low)' }}>
              {code.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
            </div>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              className="flex-1 px-5 py-4 whitespace-pre overflow-x-auto bg-transparent border-none outline-none resize-none font-mono"
              style={{ color: 'var(--color-on-surface)', minHeight: '100%' }}
              spellCheck={false}
            />
          </div>
        </div>

        <div className="flex items-center justify-center py-4" style={{ borderTop: '1px solid var(--color-border-subtle)', background: 'var(--color-surface-container-lowest)' }}>
          <button onClick={() => analyzeMutation.mutate()} disabled={analyzeMutation.isPending || !code.trim()}
                  className="flex items-center gap-3 px-7 py-3 rounded-full font-bold text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-70"
                  style={{ background: 'rgba(208,188,255,0.1)', border: '1px solid rgba(208,188,255,0.25)', color: 'var(--color-primary)', boxShadow: '0 0 20px rgba(139,92,246,0.2)' }}>
            <span className={`material-symbols-outlined text-[22px] ${analyzeMutation.isPending ? 'animate-spin' : ''}`} style={{ fontVariationSettings: "'FILL' 1" }}>
              {analyzeMutation.isPending ? 'progress_activity' : 'auto_awesome'}
            </span>
            {analyzeMutation.isPending ? 'Analyzing…' : 'Run AI Analysis'}
          </button>
        </div>
      </div>

      <div className="w-full lg:w-96 flex flex-col overflow-hidden" style={{ background: 'var(--color-surface-container-lowest)' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
          <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--color-on-surface)' }}>
            <span className="material-symbols-outlined text-xl" style={{ color: 'var(--color-primary)' }}>analytics</span>
            AI Analysis
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5">
          {!analyzeMutation.data && !analyzeMutation.isPending ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3 text-center">
              <span className="material-symbols-outlined text-5xl" style={{ color: 'var(--color-border-muted)', fontVariationSettings: "'FILL' 0" }}>code_blocks</span>
              <p className="text-sm" style={{ color: 'var(--color-outline)' }}>Run AI analysis to see insights about your code.</p>
            </div>
          ) : analyzeMutation.isPending ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3 text-center">
              <span className="material-symbols-outlined text-5xl animate-spin" style={{ color: 'var(--color-primary)' }}>progress_activity</span>
              <p className="text-sm" style={{ color: 'var(--color-outline)' }}>Analyzing your code...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: 'speed',       label: 'Time Complexity',    value: analyzeMutation.data.timeComplexity || 'N/A',    color: 'var(--color-success)'  },
                  { icon: 'memory',      label: 'Space Complexity',   value: analyzeMutation.data.spaceComplexity || 'N/A',    color: 'var(--color-warning)'  },
                  { icon: 'bug_report',  label: 'Bugs Found',         value: `${analyzeMutation.data.bugs?.length ?? 0}`,      color: 'var(--color-error)'    },
                  { icon: 'tips_and_updates', label: 'Improvements',  value: `${analyzeMutation.data.improvements?.length ?? 0}`, color: 'var(--color-primary)' },
                ].map(ins => (
                  <div key={ins.label} className="rounded-xl p-3 flex flex-col gap-1" style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-muted)' }}>
                    <span className="material-symbols-outlined text-[18px]" style={{ color: ins.color, fontVariationSettings: "'FILL' 0" }}>{ins.icon}</span>
                    <span className="font-bold text-base" style={{ color: ins.color, fontFamily: 'var(--font-mono)' }}>{ins.value}</span>
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-outline)' }}>{ins.label}</span>
                  </div>
                ))}
              </div>

              {analyzeMutation.data.bugs?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--color-outline)' }}>Bugs</h4>
                  <ul className="space-y-2">
                    {analyzeMutation.data.bugs.map((bug, i) => (
                      <li key={i} className="flex items-start gap-2 p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                        <span className="material-symbols-outlined text-[16px] flex-shrink-0" style={{ color: 'var(--color-error)' }}>bug_report</span>
                        <span style={{ color: 'var(--color-on-surface-variant)' }}>{bug}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analyzeMutation.data.improvements?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--color-outline)' }}>Improvements</h4>
                  <ul className="space-y-2">
                    {analyzeMutation.data.improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-2 p-3 rounded-xl text-sm" style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-muted)' }}>
                        <span className="material-symbols-outlined text-[16px] flex-shrink-0" style={{ color: 'var(--color-primary)' }}>tips_and_updates</span>
                        <span style={{ color: 'var(--color-on-surface-variant)' }}>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="rounded-xl p-4" style={{ background: 'rgba(208,188,255,0.06)', border: '1px solid rgba(208,188,255,0.2)' }}>
                <p className="text-xs font-bold mb-1" style={{ color: 'var(--color-primary)' }}>💡 Explanation</p>
                <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                  {analyzeMutation.data.explanation}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}