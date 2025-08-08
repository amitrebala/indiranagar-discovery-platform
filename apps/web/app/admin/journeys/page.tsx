import { Metadata } from 'next'
import { JourneyBuilder } from '@/components/admin/JourneyBuilder'
import { AdminLayout } from '@/components/admin/AdminLayout'

export const metadata: Metadata = {
  title: 'Journey Builder | Admin Dashboard',
  description: 'Create and manage journeys'
}

export default function AdminJourneysPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Journey Builder</h1>
        <JourneyBuilder />
      </div>
    </AdminLayout>
  )
}