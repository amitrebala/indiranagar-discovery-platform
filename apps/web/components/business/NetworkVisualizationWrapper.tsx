'use client'

import NetworkVisualization from './NetworkVisualization'
import { BusinessRelationship } from '@/lib/types/business-relationships'

interface NetworkVisualizationWrapperProps {
  relationships: BusinessRelationship[]
  height: number
}

export default function NetworkVisualizationWrapper({ relationships, height }: NetworkVisualizationWrapperProps) {
  return (
    <NetworkVisualization
      relationships={relationships}
      onNodeSelect={(nodeId) => console.log('Selected node:', nodeId)}
      onNodeHover={(nodeId) => console.log('Hovered node:', nodeId)}
      height={height}
    />
  )
}