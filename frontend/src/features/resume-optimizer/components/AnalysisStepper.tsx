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
    </Box>
  )
}