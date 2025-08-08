import { Metadata } from 'next'
import { SettingsForm } from '@/components/admin/SettingsForm'
import { AdminLayout } from '@/components/admin/AdminLayout'

export const metadata: Metadata = {
  title: 'Settings | Admin Dashboard',
  description: 'Configure site settings'
}

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <SettingsForm />
      </div>
    </AdminLayout>
  )
}