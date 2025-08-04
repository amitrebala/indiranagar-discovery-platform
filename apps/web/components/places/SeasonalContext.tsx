'use client'

import { useState } from 'react'
import { Cloud, Sun, CloudRain, Thermometer, Calendar, Camera } from 'lucide-react'
import { SeasonalContent } from '@/lib/types/memory-palace'

interface SeasonalContextProps {
  seasonalNotes: SeasonalContent[];
  currentWeather?: {
    condition: string;
    temperature: number;
    season: 'monsoon' | 'winter' | 'summer';
  };
  placeName: string;
}

export default function SeasonalContext({ seasonalNotes, currentWeather, placeName }: SeasonalContextProps) {
  const [selectedSeason, setSelectedSeason] = useState<string>(
    currentWeather?.season || 'winter'
  )

  if (seasonalNotes.length === 0) return null

  const getSeasonIcon = (season: string) => {
    switch (season) {
      case 'monsoon':
        return <CloudRain className="w-5 h-5" />
      case 'summer':
        return <Sun className="w-5 h-5" />
      case 'winter':
        return <Cloud className="w-5 h-5" />
      default:
        return <Calendar className="w-5 h-5" />
    }
  }

  const getSeasonColor = (season: string) => {
    switch (season) {
      case 'monsoon':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          button: 'bg-blue-100 hover:bg-blue-200 text-blue-800',
          activeButton: 'bg-blue-500 text-white'
        }
      case 'summer':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          text: 'text-orange-800',
          button: 'bg-orange-100 hover:bg-orange-200 text-orange-800',
          activeButton: 'bg-orange-500 text-white'
        }
      case 'winter':
        return {
          bg: 'bg-cyan-50',
          border: 'border-cyan-200',
          text: 'text-cyan-800',
          button: 'bg-cyan-100 hover:bg-cyan-200 text-cyan-800',
          activeButton: 'bg-cyan-500 text-white'
        }
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          button: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
          activeButton: 'bg-gray-500 text-white'
        }
    }
  }

  const getCurrentSeasonalNote = () => {
    return seasonalNotes.find(note => note.season === selectedSeason)
  }

  const seasonalNote = getCurrentSeasonalNote()
  const colors = getSeasonColor(selectedSeason)

  return (
    <section className="seasonal-context mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Thermometer className="w-6 h-6 text-blue-600" />
        Seasonal Experience Guide
      </h2>

      {/* Current Weather Alert */}
      {currentWeather && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800 font-medium">
              Current: {currentWeather.condition}, {currentWeather.temperature}°C ({currentWeather.season})
            </span>
          </div>
        </div>
      )}

      {/* Season Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {seasonalNotes.map((note) => {
          const isActive = selectedSeason === note.season
          const seasonColors = getSeasonColor(note.season)
          
          return (
            <button
              key={note.season}
              onClick={() => setSelectedSeason(note.season)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isActive ? seasonColors.activeButton : seasonColors.button
              }`}
            >
              {getSeasonIcon(note.season)}
              <span className="capitalize">{note.season}</span>
            </button>
          )
        })}
      </div>

      {/* Selected Season Content */}
      {seasonalNote && (
        <div className={`${colors.bg} ${colors.border} border rounded-xl p-6`}>
          <div className="flex items-start gap-3 mb-4">
            {getSeasonIcon(seasonalNote.season)}
            <div className="flex-1">
              <h3 className={`font-bold ${colors.text} text-lg mb-2 capitalize`}>
                {seasonalNote.season} Experience at {placeName}
              </h3>
              <p className={`${colors.text} leading-relaxed mb-4`}>
                {seasonalNote.description}
              </p>
            </div>
          </div>

          {/* What to Expect */}
          <div className="mb-6">
            <h4 className={`font-semibold ${colors.text} mb-2`}>What to Expect</h4>
            <p className={`${colors.text} text-sm leading-relaxed bg-white bg-opacity-60 p-3 rounded border`}>
              {seasonalNote.what_to_expect}
            </p>
          </div>

          {/* Best Times */}
          {seasonalNote.best_times.length > 0 && (
            <div className="mb-6">
              <h4 className={`font-semibold ${colors.text} mb-3 flex items-center gap-2`}>
                <Calendar className="w-4 h-4" />
                Best Times to Visit
              </h4>
              <div className="flex flex-wrap gap-2">
                {seasonalNote.best_times.map((time, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 ${colors.button} rounded-full text-sm font-medium`}
                  >
                    {time}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="mb-6">
            <h4 className={`font-semibold ${colors.text} mb-3`}>Seasonal Recommendations</h4>
            <div className="grid gap-2">
              {seasonalNote.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className={`w-2 h-2 ${colors.activeButton.split(' ')[0]} rounded-full mt-2 flex-shrink-0`} />
                  <span className={`${colors.text} text-sm`}>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Photo References */}
          {seasonalNote.photo_references.length > 0 && (
            <div>
              <h4 className={`font-semibold ${colors.text} mb-3 flex items-center gap-2`}>
                <Camera className="w-4 h-4" />
                Seasonal Photos
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {seasonalNote.photo_references.map((photo, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                    <img
                      src={photo}
                      alt={`${seasonalNote.season} view of ${placeName}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Seasonal Planning Tip */}
      <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-indigo-900 mb-1">Planning Your Visit</h4>
            <p className="text-indigo-800 text-sm leading-relaxed">
              Each season offers a unique experience at {placeName}. Use this guide to time your visit 
              for the atmosphere and activities that match your preferences. The recommendations come 
              from multiple visits across different seasons.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}