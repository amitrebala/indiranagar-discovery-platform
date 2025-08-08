import { Metadata } from 'next'
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard'
import { AdminLayout } from '@/components/admin/AdminLayout'

export const metadata: Metadata = {
  title: 'Analytics | Admin Dashboard',
  description: 'View site analytics and metrics'
}

export default function AdminAnalyticsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <AnalyticsDashboard />
      </div>
    </AdminLayout>
  )
}