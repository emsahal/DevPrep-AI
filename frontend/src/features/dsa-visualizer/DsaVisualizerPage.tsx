import { useState, useEffect, useCallback } from 'react'
import { QuestionBrowser } from '@/features/dsa-visualizer/components/QuestionBrowser'
import VisualizationEngine from '@/features/dsa-visualizer/components/VisualizationEngine'
import CodePanel from '@/features/dsa-visualizer/components/CodePanel'
import VariablePanel from '@/features/dsa-visualizer/components/VariablePanel'
import PseudocodePanel from '@/features/dsa-visualizer/components/PseudocodePanel'
import StepControls from '@/features/dsa-visualizer/components/StepControls'
import SummaryPanel from '@/features/dsa-visualizer/components/SummaryPanel'
import { getQuestionById } from '@/features/dsa-visualizer/data'
import type { QuestionData } from '@/features/dsa-visualizer/types'

type CodeLanguage = 'cpp' | 'javascript'
type RightTab = 'code' | 'js' | 'pseudocode' | 'variables' | 'summary'

const styles = {
  container: {
    display: 'flex',
    height: '100%',
    background: 'var(--color-surface-container-lowest, #0F0F1A)',
    color: 'var(--color-on-surface, #E0E0F0)',
    overflow: 'hidden',
  },
  sidebar: {
    width: 280,
    flexShrink: 0,
    borderRight: '1px solid var(--color-border-muted, #2A2A4E)',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    minWidth: 0,
  },
  visualizationArea: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--color-surface-container-low, #1A1A2E)',
    borderBottom: '1px solid var(--color-border-subtle, #2A2A4E)',
    minHeight: 0,
    overflow: 'hidden',
    position: 'relative' as const,
  },
  controlsArea: {
    padding: '12px 16px',
    background: 'var(--color-surface-container, #1A1A2E)',
  },
  rightPanel: {
    width: 350,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    borderLeft: '1px solid var(--color-border-muted, #2A2A4E)',
    background: 'var(--color-surface-container-low, #1A1A2E)',
  },
  tabBar: {
    display: 'flex',
    borderBottom: '1px solid var(--color-border-subtle, #2A2A4E)',
    flexShrink: 0,
  },
  tab: (active: boolean) => ({
    flex: 1,
    padding: '10px 4px',
    fontSize: 12,
    fontWeight: 600,
    textAlign: 'center' as const,
    cursor: 'pointer',
    color: active ? 'var(--color-primary, #8B5CF6)' : 'var(--color-on-surface-variant, #9898B0)',
    borderBottom: active ? '2px solid var(--color-primary, #8B5CF6)' : '2px solid transparent',
    transition: 'color 0.15s, border-color 0.15s',
    background: 'transparent',
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    userSelect: 'none' as const,
  }),
  tabContent: {
    flex: 1,
    overflow: 'auto',
    minHeight: 0,
  },
  placeholder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: 'var(--color-on-surface-variant, #9898B0)',
    fontSize: 15,
    textAlign: 'center' as const,
    padding: 24,
  },
  emptyState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: 'var(--color-on-surface-variant, #9898B0)',
    fontSize: 18,
    textAlign: 'center' as const,
    padding: 48,
    lineHeight: 1.6,
  },
}

const tabOrder: { key: RightTab; label: string }[] = [
  { key: 'code', label: 'Code' },
  { key: 'js', label: 'JS' },
  { key: 'pseudocode', label: 'Pseudocode' },
  { key: 'variables', label: 'Variables' },
  { key: 'summary', label: 'Summary' },
]

export function DsaVisualizerPage() {
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [codeLanguage, setCodeLanguage] = useState<CodeLanguage>('cpp')
  const [rightTab, setRightTab] = useState<RightTab>('code')
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)

  const selectedQuestion: QuestionData | undefined = selectedQuestionId
    ? getQuestionById(selectedQuestionId)
    : undefined

  const totalSteps = selectedQuestion?.steps.length ?? 0
  const isLastStep = currentStep >= totalSteps - 1 && totalSteps > 0

  useEffect(() => {
    if (rightTab === 'summary' && !isLastStep) {
      setRightTab('code')
    }
  }, [isLastStep, rightTab])

  const handleSelectQuestion = useCallback((questionId: string) => {
    setSelectedQuestionId(questionId)
    setCurrentStep(0)
    setIsAutoPlaying(false)
    setRightTab('code')
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= (selectedQuestion?.steps.length ?? 0) - 1) {
          return prev
        }
        return prev + 1
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, selectedQuestion])

  useEffect(() => {
    if (isLastStep) {
      setIsAutoPlaying(false)
    }
  }, [isLastStep])

  const handleNext = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1))
  }, [totalSteps])

  const handlePrev = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }, [])

  const handleReset = useCallback(() => {
    setCurrentStep(0)
    setIsAutoPlaying(false)
  }, [])

  const handleToggleAutoPlay = useCallback(() => {
    if (isLastStep) {
      setCurrentStep(0)
    }
    setIsAutoPlaying(prev => !prev)
  }, [isLastStep])

  const handleSelectTab = useCallback((tab: RightTab) => {
    if (tab === 'summary' && !isLastStep) return
    setRightTab(tab)
  }, [isLastStep])

  const activeTab = isLastStep ? rightTab : rightTab === 'summary' ? 'code' : rightTab

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <QuestionBrowser
          onSelect={handleSelectQuestion}
          selectedId={selectedQuestionId ?? undefined}
        />
      </div>

      <div style={styles.mainContent}>
        {!selectedQuestion ? (
          <div style={styles.emptyState}>
            Select a question from the sidebar<br />to start the visualization
          </div>
        ) : (
          <>
            <div style={styles.visualizationArea}>
              <VisualizationEngine
                question={selectedQuestion}
                currentStep={currentStep}
              />
            </div>
            <div style={styles.controlsArea}>
              <StepControls
                currentStep={currentStep}
                totalSteps={totalSteps}
                onNext={handleNext}
                onPrev={handlePrev}
                onReset={handleReset}
                isAutoPlaying={isAutoPlaying}
                onToggleAutoPlay={handleToggleAutoPlay}
              />
            </div>
          </>
        )}
      </div>

      <div style={styles.rightPanel}>
        {!selectedQuestion ? (
          <div style={styles.placeholder}>Select a question to begin</div>
        ) : (
          <>
            <div style={styles.tabBar}>
              {tabOrder.map(({ key, label }) => {
                const disabled = key === 'summary' && !isLastStep
                return (
                  <button
                    key={key}
                    style={{
                      ...styles.tab(activeTab === key && !disabled),
                      opacity: disabled ? 0.4 : 1,
                      cursor: disabled ? 'not-allowed' : 'pointer',
                    }}
                    onClick={() => !disabled && handleSelectTab(key)}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
            <div style={styles.tabContent}>
              {activeTab === 'code' && (
                <CodePanel
                  code={selectedQuestion.code.cpp}
                  language="cpp"
                  currentStep={currentStep}
                  steps={selectedQuestion.steps}
                />
              )}
              {activeTab === 'js' && (
                <CodePanel
                  code={selectedQuestion.code.javascript}
                  language="javascript"
                  currentStep={currentStep}
                  steps={selectedQuestion.steps}
                />
              )}
              {activeTab === 'pseudocode' && (
                <PseudocodePanel
                  pseudocode={selectedQuestion.pseudocode}
                  currentStep={currentStep}
                />
              )}
              {activeTab === 'variables' && (
                <VariablePanel
                  question={selectedQuestion}
                  currentStep={currentStep}
                />
              )}
              {activeTab === 'summary' && isLastStep && (
                <SummaryPanel question={selectedQuestion} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}