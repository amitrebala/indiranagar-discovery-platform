'use client';

import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';

interface CommunityEvent {
  id: string;
  title: string;
  start_time: string;
  category: string;
  status: string;
}

interface EventCalendarProps {
  events: CommunityEvent[];
  onEventSelect?: (event: CommunityEvent) => void;
  selectedCategories?: string[];
  onCategoryFilter?: (categories: string[]) => void;
}

export const EventCalendar = ({ 
  events, 
  onEventSelect, 
  selectedCategories = [], 
  onCategoryFilter 
}: EventCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [showFilters, setShowFilters] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.start_time), date) &&
      (selectedCategories.length === 0 || selectedCategories.includes(event.category))
    );
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const categoryColors = {
    food_festival: 'bg-red-100 text-red-800',
    market: 'bg-orange-100 text-orange-800',
    cultural_event: 'bg-purple-100 text-purple-800',
    running_group: 'bg-green-100 text-green-800',
    meetup: 'bg-blue-100 text-blue-800',
    workshop: 'bg-gray-100 text-gray-800'
  };

  const navigateMonth = (direction: 'previous' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  return (
    <div className="event-calendar bg-white rounded-lg shadow-sm border">
      {/* Calendar Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex space-x-1">
              <button
                onClick={() => navigateMonth('previous')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            
            <div className="flex rounded-lg border overflow-hidden">
              {['month', 'week', 'day'].map((mode) => (
                <button
                  key={mode}
                  className={`px-3 py-1 text-sm capitalize ${
                    viewMode === mode
                      ? 'bg-yellow-400 text-black'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setViewMode(mode as any)}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Category Filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            {Object.entries(categoryColors).map(([category, colorClass]) => {
              const isSelected = selectedCategories.includes(category);
              return (
                <button
                  key={category}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-yellow-400 text-black'
                      : colorClass + ' hover:opacity-80'
                  }`}
                  onClick={() => {
                    const newCategories = isSelected
                      ? selectedCategories.filter(c => c !== category)
                      : [...selectedCategories, category];
                    onCategoryFilter?.(newCategories);
                  }}
                >
                  {category.replace('_', ' ')}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          {viewMode === 'month' && (
            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {calendarDays.map(day => {
                const dayEvents = getEventsForDate(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());
                
                return (
                  <div
                    key={day.toISOString()}
                    className={`min-h-[80px] p-1 border rounded cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-yellow-50 border-yellow-400'
                        : isToday
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    } ${
                      !isSameMonth(day, currentDate) ? 'opacity-40' : ''
                    }`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isToday ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {format(day, 'd')}
                    </div>
                    
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map(event => (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded truncate ${
                            categoryColors[event.category as keyof typeof categoryColors]
                          }`}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Date Events */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              {selectedDate 
                ? `Events on ${format(selectedDate, 'MMM d, yyyy')}`
                : 'Select a date to view events'
              }
            </h3>
            
            {selectedDateEvents.length === 0 ? (
              <p className="text-gray-500 text-sm">
                {selectedDate ? 'No events on this date.' : 'Click on a calendar date to see events.'}
              </p>
            ) : (
              <div className="space-y-3">
                {selectedDateEvents.map(event => (
                  <div 
                    key={event.id}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => onEventSelect?.(event)}
                  >
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600 capitalize">
                      {event.category.replace('_', ' ')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};