'use client'

import { useState, useEffect } from 'react'
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Save, MapPin, Clock, Camera, Trash2, GripVertical } from 'lucide-react'
import { toast } from 'sonner'
import { SortableStop } from './SortableStop'
import { JourneyPreview } from './JourneyPreview'

interface JourneyStop {
  id: string
  placeId: string
  placeName: string
  order: number
  duration: number // in minutes
  activities: string[]
  photoOp: boolean
  notes: string
}

interface Journey {
  id?: string
  name: string
  slug: string
  description: string
  mood: string
  difficulty: 'easy' | 'moderate' | 'challenging'
  duration: number // total in minutes
  distance: number // in km
  stops: JourneyStop[]
  themes: string[]
  bestTime: string
  imageUrl?: string
}

export function JourneyBuilder() {
  const [journey, setJourney] = useState<Journey>({
    name: '',
    slug: '',
    description: '',
    mood: 'casual',
    difficulty: 'easy',
    duration: 0,
    distance: 0,
    stops: [],
    themes: [],
    bestTime: 'morning'
  })
  const [places, setPlaces] = useState<any[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchPlaces()
  }, [])

  const fetchPlaces = async () => {
    try {
      const response = await fetch('/api/places')
      if (response.ok) {
        const data = await response.json()
        setPlaces(data)
      }
    } catch (error) {
      console.error('Failed to fetch places:', error)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = journey.stops.findIndex(s => s.id === active.id)
    const newIndex = journey.stops.findIndex(s => s.id === over.id)
    
    const newStops = arrayMove(journey.stops, oldIndex, newIndex).map((stop, index) => ({
      ...stop,
      order: index + 1
    }))
    
    setJourney({ ...journey, stops: newStops })
  }

  const addStop = () => {
    const newStop: JourneyStop = {
      id: `stop-${Date.now()}`,
      placeId: '',
      placeName: '',
      order: journey.stops.length + 1,
      duration: 30,
      activities: [],
      photoOp: false,
      notes: ''
    }
    setJourney({ ...journey, stops: [...journey.stops, newStop] })
  }

  const updateStop = (stopId: string, updates: Partial<JourneyStop>) => {
    const newStops = journey.stops.map(stop => 
      stop.id === stopId ? { ...stop, ...updates } : stop
    )
    setJourney({ ...journey, stops: newStops })
    calculateTotalDuration(newStops)
  }

  const removeStop = (stopId: string) => {
    const newStops = journey.stops
      .filter(s => s.id !== stopId)
      .map((stop, index) => ({ ...stop, order: index + 1 }))
    setJourney({ ...journey, stops: newStops })
    calculateTotalDuration(newStops)
  }

  const calculateTotalDuration = (stops: JourneyStop[]) => {
    const total = stops.reduce((sum, stop) => sum + stop.duration, 0)
    setJourney(prev => ({ ...prev, duration: total }))
  }

  const handleSave = async () => {
    if (!journey.name || !journey.slug || journey.stops.length === 0) {
      toast.error('Please fill in all required fields and add at least one stop')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/admin/journeys', {
        method: journey.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(journey)
      })

      if (response.ok) {
        const data = await response.json()
        setJourney({ ...journey, id: data.id })
        toast.success('Journey saved successfully!')
      } else {
        throw new Error('Failed to save journey')
      }
    } catch (error) {
      toast.error('Failed to save journey')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Journey Details */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Journey Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Journey Name</Label>
              <Input
                id="name"
                value={journey.name}
                onChange={(e) => setJourney({ ...journey, name: e.target.value })}
                placeholder="Morning Coffee Trail"
              />
            </div>
            
            <div>
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={journey.slug}
                onChange={(e) => setJourney({ ...journey, slug: e.target.value })}
                placeholder="morning-coffee-trail"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={journey.description}
                onChange={(e) => setJourney({ ...journey, description: e.target.value })}
                placeholder="A perfect morning journey through Indiranagar's best coffee spots..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mood">Mood</Label>
                <Select 
                  value={journey.mood} 
                  onValueChange={(value) => setJourney({ ...journey, mood: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="romantic">Romantic</SelectItem>
                    <SelectItem value="adventurous">Adventurous</SelectItem>
                    <SelectItem value="cultural">Cultural</SelectItem>
                    <SelectItem value="foodie">Foodie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select 
                  value={journey.difficulty} 
                  onValueChange={(value: any) => setJourney({ ...journey, difficulty: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="challenging">Challenging</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bestTime">Best Time</Label>
                <Select 
                  value={journey.bestTime} 
                  onValueChange={(value) => setJourney({ ...journey, bestTime: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="afternoon">Afternoon</SelectItem>
                    <SelectItem value="evening">Evening</SelectItem>
                    <SelectItem value="night">Night</SelectItem>
                    <SelectItem value="anytime">Anytime</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="distance">Distance (km)</Label>
                <Input
                  id="distance"
                  type="number"
                  step="0.1"
                  value={journey.distance}
                  onChange={(e) => setJourney({ ...journey, distance: parseFloat(e.target.value) })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Journey Stops */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Journey Stops</CardTitle>
            <Button onClick={addStop} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Stop
            </Button>
          </CardHeader>
          <CardContent>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext 
                items={journey.stops.map(s => s.id)} 
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {journey.stops.map((stop) => (
                    <SortableStop
                      key={stop.id}
                      stop={stop}
                      places={places}
                      onUpdate={(updates) => updateStop(stop.id, updates)}
                      onRemove={() => removeStop(stop.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
            
            {journey.stops.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No stops added yet. Click "Add Stop" to begin building your journey.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Stops</span>
              <span className="font-medium">{journey.stops.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Duration</span>
              <span className="font-medium">{Math.floor(journey.duration / 60)}h {journey.duration % 60}m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Distance</span>
              <span className="font-medium">{journey.distance} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Photo Ops</span>
              <span className="font-medium">{journey.stops.filter(s => s.photoOp).length}</span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              onClick={() => setShowPreview(!showPreview)} 
              variant="outline" 
              className="w-full"
            >
              {showPreview ? 'Hide' : 'Show'} Preview
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving} 
              className="w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Journey'}
            </Button>
          </CardContent>
        </Card>

        {/* Preview */}
        {showPreview && (
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <JourneyPreview journey={journey} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}