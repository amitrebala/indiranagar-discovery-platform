'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

interface SiteSettings {
  siteName: string
  siteDescription: string
  contactEmail: string
  maintenanceMode: boolean
  allowComments: boolean
  allowRatings: boolean
  weatherEnabled: boolean
  analyticsEnabled: boolean
  maxUploadSize: number
  defaultMapCenter: { lat: number; lng: number }
  socialLinks: {
    twitter?: string
    instagram?: string
    facebook?: string
  }
}

export function SettingsForm() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Indiranagar Discovery Platform',
    siteDescription: 'Discover the heart of Bangalore',
    contactEmail: 'admin@indiranagar.com',
    maintenanceMode: false,
    allowComments: true,
    allowRatings: true,
    weatherEnabled: true,
    analyticsEnabled: true,
    maxUploadSize: 5242880, // 5MB
    defaultMapCenter: { lat: 12.9716, lng: 77.5946 },
    socialLinks: {}
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      
      if (response.ok) {
        toast.success('Settings saved successfully')
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="features">Features</TabsTrigger>
        <TabsTrigger value="social">Social</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general" className="space-y-4">
        <div>
          <Label htmlFor="siteName">Site Name</Label>
          <Input
            id="siteName"
            value={settings.siteName}
            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="siteDescription">Site Description</Label>
          <Input
            id="siteDescription"
            value={settings.siteDescription}
            onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="contactEmail">Contact Email</Label>
          <Input
            id="contactEmail"
            type="email"
            value={settings.contactEmail}
            onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="features" className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="maintenance">Maintenance Mode</Label>
          <Switch
            id="maintenance"
            checked={settings.maintenanceMode}
            onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="comments">Allow Comments</Label>
          <Switch
            id="comments"
            checked={settings.allowComments}
            onCheckedChange={(checked) => setSettings({ ...settings, allowComments: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="ratings">Allow Ratings</Label>
          <Switch
            id="ratings"
            checked={settings.allowRatings}
            onCheckedChange={(checked) => setSettings({ ...settings, allowRatings: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="weather">Weather Integration</Label>
          <Switch
            id="weather"
            checked={settings.weatherEnabled}
            onCheckedChange={(checked) => setSettings({ ...settings, weatherEnabled: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="analytics">Analytics</Label>
          <Switch
            id="analytics"
            checked={settings.analyticsEnabled}
            onCheckedChange={(checked) => setSettings({ ...settings, analyticsEnabled: checked })}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="social" className="space-y-4">
        <div>
          <Label htmlFor="twitter">Twitter URL</Label>
          <Input
            id="twitter"
            value={settings.socialLinks.twitter || ''}
            onChange={(e) => setSettings({ 
              ...settings, 
              socialLinks: { ...settings.socialLinks, twitter: e.target.value }
            })}
            placeholder="https://twitter.com/yourusername"
          />
        </div>
        <div>
          <Label htmlFor="instagram">Instagram URL</Label>
          <Input
            id="instagram"
            value={settings.socialLinks.instagram || ''}
            onChange={(e) => setSettings({ 
              ...settings, 
              socialLinks: { ...settings.socialLinks, instagram: e.target.value }
            })}
            placeholder="https://instagram.com/yourusername"
          />
        </div>
        <div>
          <Label htmlFor="facebook">Facebook URL</Label>
          <Input
            id="facebook"
            value={settings.socialLinks.facebook || ''}
            onChange={(e) => setSettings({ 
              ...settings, 
              socialLinks: { ...settings.socialLinks, facebook: e.target.value }
            })}
            placeholder="https://facebook.com/yourpage"
          />
        </div>
      </TabsContent>
      
      <TabsContent value="advanced" className="space-y-4">
        <div>
          <Label htmlFor="maxUpload">Max Upload Size (bytes)</Label>
          <Input
            id="maxUpload"
            type="number"
            value={settings.maxUploadSize}
            onChange={(e) => setSettings({ ...settings, maxUploadSize: parseInt(e.target.value) })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="mapLat">Default Map Latitude</Label>
            <Input
              id="mapLat"
              type="number"
              step="0.0001"
              value={settings.defaultMapCenter.lat}
              onChange={(e) => setSettings({ 
                ...settings, 
                defaultMapCenter: { ...settings.defaultMapCenter, lat: parseFloat(e.target.value) }
              })}
            />
          </div>
          <div>
            <Label htmlFor="mapLng">Default Map Longitude</Label>
            <Input
              id="mapLng"
              type="number"
              step="0.0001"
              value={settings.defaultMapCenter.lng}
              onChange={(e) => setSettings({ 
                ...settings, 
                defaultMapCenter: { ...settings.defaultMapCenter, lng: parseFloat(e.target.value) }
              })}
            />
          </div>
        </div>
      </TabsContent>
      
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </Tabs>
  )
}