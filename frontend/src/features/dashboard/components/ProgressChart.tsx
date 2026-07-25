import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { LearningProgressItem } from '@/services/dashboardService'

interface ProgressChartProps {
  data: LearningProgressItem[] | undefined
  isLoading: boolean
}

const COLORS = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2']

export function ProgressChart({ data, isLoading }: ProgressChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-5 w-40 animate-pulse rounded bg-muted" />
        </CardHeader>
        <CardContent>
          <div className="h-64 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Learning Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-sm text-muted-foreground">
            No learning data yet. Start a learning path to see progress.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                unit="%"
              />
              <Tooltip
                formatter={(value) => [`${value}%`, 'Progress']}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid hsl(var(--border))',
                }}
              />
              <Bar dataKey="progress" radius={[4, 4, 0, 0]} maxBarSize={40}>
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
