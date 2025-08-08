'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { GripVertical, Trash2, Camera, Clock } from 'lucide-react'

interface SortableStopProps {
  stop: any
  places: any[]
  onUpdate: (updates: any) => void
  onRemove: () => void
}

export function SortableStop({ stop, places, onUpdate, onRemove }: SortableStopProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: stop.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <Card ref={setNodeRef} style={style} className={isDragging ? 'shadow-lg' : ''}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div 
            className="flex items-center cursor-move"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Stop #{stop.order}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div>
              <Label>Place</Label>
              <Select
                value={stop.placeId}
                onValueChange={(value) => {
                  const place = places.find(p => p.id === value)
                  onUpdate({ placeId: value, placeName: place?.name || '' })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a place" />
                </SelectTrigger>
                <SelectContent>
                  {places.map(place => (
                    <SelectItem key={place.id} value={place.id}>
                      {place.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Duration (minutes)</Label>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={stop.duration}
                    onChange={(e) => onUpdate({ duration: parseInt(e.target.value) })}
                    min="5"
                    step="5"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor={`photo-${stop.id}`}>Photo Op</Label>
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-muted-foreground" />
                  <Switch
                    id={`photo-${stop.id}`}
                    checked={stop.photoOp}
                    onCheckedChange={(checked) => onUpdate({ photoOp: checked })}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <Label>Notes / Activities</Label>
              <Textarea
                value={stop.notes}
                onChange={(e) => onUpdate({ notes: e.target.value })}
                placeholder="What to do here, special tips, etc."
                rows={2}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}