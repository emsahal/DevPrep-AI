import { useEffect, useState, type ReactNode } from 'react'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { useThemeStore } from '@/store/themeStore'
import { lightTheme, darkTheme } from '@/lib/theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme } = useThemeStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const resolvedTheme = (() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return theme
  })()

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
    }
  }, [resolvedTheme, mounted])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <MuiThemeProvider theme={resolvedTheme === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}
