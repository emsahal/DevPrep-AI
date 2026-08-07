import type { IconType } from 'react-icons'
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiGraphql,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  SiGit,
  SiDocker,
  SiNginx,
  SiPm2,
  SiMysql,
} from 'react-icons/si'
import {
  TbApi,
  TbLockAccess,
  TbGitMerge,
  TbTestPipe,
  TbGauge,
  TbShieldLock,
  TbTopologyStar3,
  TbBinaryTree,
} from 'react-icons/tb'
import { MaterialIcon } from '@/components/common/MaterialIcon'

const BRAND_ICONS: Record<string, { Icon: IconType; color: string }> = {
  html: { Icon: SiHtml5, color: '#E34F26' },
  css: { Icon: SiCss, color: '#1572B6' },
  javascript: { Icon: SiJavascript, color: '#F7DF1E' },
  typescript: { Icon: SiTypescript, color: '#3178C6' },
  react: { Icon: SiReact, color: '#61DAFB' },
  nextjs: { Icon: SiNextdotjs, color: '#FFFFFF' },
  nodejs: { Icon: SiNodedotjs, color: '#5FA04E' },
  expressjs: { Icon: SiExpress, color: '#FFFFFF' },
  'rest-apis': { Icon: TbApi, color: '#FF6C2C' },
  graphql: { Icon: SiGraphql, color: '#E535AB' },
  authentication: { Icon: TbLockAccess, color: '#FFB703' },
  mongodb: { Icon: SiMongodb, color: '#47A248' },
  postgresql: { Icon: SiPostgresql, color: '#4169E1' },
  mysql: { Icon: SiMysql, color: '#4479A1' },
  redis: { Icon: SiRedis, color: '#DC382D' },
  git: { Icon: SiGit, color: '#F05032' },
  docker: { Icon: SiDocker, color: '#2496ED' },
  cicd: { Icon: TbGitMerge, color: '#2396ED' },
  nginx: { Icon: SiNginx, color: '#009639' },
  pm2: { Icon: SiPm2, color: '#A78BFA' },
  testing: { Icon: TbTestPipe, color: '#C21325' },
  performance: { Icon: TbGauge, color: '#EAB308' },
  security: { Icon: TbShieldLock, color: '#DC2626' },
  'system-design': { Icon: TbTopologyStar3, color: '#0891B2' },
  dsa: { Icon: TbBinaryTree, color: '#7C3AED' },
}

interface TechLogoProps {
  slug: string
  icon?: string
  size?: number
  color?: string
}

export function TechLogo({ slug, icon, size = 26, color }: TechLogoProps) {
  const brand = BRAND_ICONS[slug]
  if (brand) {
    const Icon = brand.Icon
    const forceWhite = slug === 'nextjs' || slug === 'expressjs'
    const iconColor = forceWhite ? '#FFFFFF' : color || brand.color
    return <Icon style={{ color: iconColor, fontSize: size }} />
  }
  return <MaterialIcon name={icon || 'code'} className="text-[26px]" style={{ color, fontSize: size }} />
}
