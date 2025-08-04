'use client'

import AnalyticsDashboard from './AnalyticsDashboard'
import { DashboardMetrics } from '@/lib/types/analytics'

interface AnalyticsDashboardWrapperProps {
  metrics: DashboardMetrics
}

export default function AnalyticsDashboardWrapper({ metrics }: AnalyticsDashboardWrapperProps) {
  return (
    <AnalyticsDashboard
      metrics={metrics}
      onTimeRangeChange={(period) => {
        console.log('Time range changed:', period)
      }}
      onExport={() => {
        console.log('Export analytics requested')
      }}
    />
  )
}