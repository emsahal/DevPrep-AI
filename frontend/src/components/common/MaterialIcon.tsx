import type { CSSProperties } from 'react'

const ICON_ALIASES: Record<string, string> = {
  'file-type-html': 'code_blocks',
  'file-type-css': 'style',
  'file-type-js': 'data_object',
  'file-type-ts': 'integration_instructions',
  react: 'view_in_ar',
  nextjs: 'deployed_code',
  nodejs: 'dns',
  express: 'route',
  graphql: 'hub',
  mongodb: 'database',
  postgresql: 'table_chart',
  redis: 'memory',
  git: 'account_tree',
  docker: 'deployed_code',
  cicd: 'sync_alt',
  nginx: 'lan',
  pm2: 'settings_applications',
  test: 'science',
  zap: 'bolt',
  shield: 'security',
  layout: 'dashboard',
  'git-branch': 'account_tree',
  globe: 'public',
  server: 'dns',
  terminal: 'terminal',

  javascript: 'data_object',
  typescript: 'integration_instructions',
  next_js: 'deployed_code',
  node_js: 'dns',
  express_js: 'route',
  mongodb: 'database',
  postgresql: 'table_chart',
  api: 'api',
  test_tube: 'science',
  speed: 'speed',
  devops: 'sync_alt',
  architecture: 'account_tree',
  algorithm: 'polyline',
  palette: 'palette',
  quiz: 'quiz',
}

interface MaterialIconProps {
  name: string
  className?: string
  style?: CSSProperties
}

export function materialIconName(name: string) {
  return ICON_ALIASES[name] ?? name.replaceAll('-', '_')
}

export function MaterialIcon({ name, className, style }: MaterialIconProps) {
  return (
    <span className={`material-symbols-outlined ${className ?? ''}`} style={style}>
      {materialIconName(name)}
    </span>
  )
}
