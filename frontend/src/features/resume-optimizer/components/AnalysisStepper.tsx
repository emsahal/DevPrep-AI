import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import CircularProgress from '@mui/material/CircularProgress'
import { ANALYSIS_STEPS, useResumeOptimizerStore, type AnalysisStepStatus } from '@/store/resumeOptimizerStore'

const STATUS_ICON_COLOR: Record<AnalysisStepStatus, string> = {
  pending: '#958ea0',
  active: '#d0bcff',
  done: '#10B981',
  error: '#EF4444',
}

const STEP_LABELS: Record<string, string> = {
  analyze: 'Analyzing job description',
  optimize: 'Optimizing resume',
  'cover-letter': 'Generating cover letter',
  finalize: 'Finalizing results',
}

export function AnalysisStepper() {
  const progressSteps = useResumeOptimizerStore(s => s.progressSteps)
  const liveText = useResumeOptimizerStore(s => s.liveText)

  const statusMap = new Map<string, AnalysisStepStatus>()
  progressSteps.forEach((st) => statusMap.set(st.key, st.status))

  const activeIndex = Math.max(
    0,
    progressSteps.findIndex((st) => st.status === 'active'),
  )

  const activeStatus = progressSteps.find((st) => st.status === 'active')?.status ?? 'done'
  const allDone = progressSteps.every((st) => st.status === 'done')

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeIndex} alternativeLabel>
        {ANALYSIS_STEPS.map(({ key, label }) => {
          const status = statusMap.get(key) ?? 'pending'
          return (
            <Step key={key}>
              <StepLabel
                slotProps={{
                  stepIcon: {
                    active: status === 'active',
                    completed: status === 'done',
                    error: status === 'error',
                    icon: status === 'active' ? (
                      <CircularProgress size={20} thickness={5} sx={{ color: STATUS_ICON_COLOR.active }} />
                    ) : undefined,
                  },
                }}
                sx={{
                  '& .MuiStepLabel-label': {
                    color: status === 'active' ? '#e5e2e1' : status === 'done' ? '#10B981' : '#958ea0',
                    fontWeight: status === 'active' ? 700 : 500,
                    fontSize: 12,
                    whiteSpace: 'nowrap',
                  },
                  '& .MuiStepLabel-iconContainer': {
                    color: STATUS_ICON_COLOR[status],
                  },
                }}
              >
                {STEP_LABELS[key] ?? label}
              </StepLabel>
            </Step>
          )
        })}
      </Stepper>

      {/* Live status line */}
      {!allDone && activeStatus === 'active' && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mt: 3 }}>
          <CircularProgress size={16} thickness={5} sx={{ color: '#d0bcff' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#e5e2e1' }}>
            {STEP_LABELS[progressSteps[activeIndex]?.key ?? 'optimize']}…
          </span>
        </Box>
      )}

      {/* Realtime stream preview */}
      {liveText && (
        <Box
          sx={{
            mx: 'auto',
            mt: 3,
            maxWidth: 720,
            maxHeight: 160,
            overflow: 'auto',
            p: 2,
            borderRadius: 2,
            border: '1px solid rgba(208,188,255,0.15)',
            background: 'rgba(0,0,0,0.35)',
            fontSize: 12,
            lineHeight: 1.6,
            color: '#cbc3d7',
            fontFamily: '"JetBrains Mono", monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {liveText}
          <span style={{ display: 'inline-block', width: 7, height: 14, verticalAlign: 'text-bottom', marginLeft: 2, background: '#d0bcff', animation: 'blink 1s step-start infinite' as any }} />
        </Box>
      )}
    </Box>
  )
}