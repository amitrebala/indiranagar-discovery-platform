'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Filter, ZoomIn, ZoomOut, Maximize2, Download } from 'lucide-react'
import { NetworkMap, BusinessRelationship } from '@/lib/types/business-relationships'

interface NetworkVisualizationProps {
  relationships: BusinessRelationship[]
  onNodeSelect?: (nodeId: string) => void
  onNodeHover?: (nodeId: string | null) => void
  height?: number
  interactive?: boolean
}

interface Node {
  id: string
  name: string
  type: 'business' | 'person' | 'category'
  x: number
  y: number
  size: number
  color: string
  connections: number
  relationship?: BusinessRelationship
}

interface Edge {
  source: string
  target: string
  strength: number
  type: string
}

export default function NetworkVisualization({
  relationships,
  onNodeSelect,
  onNodeHover,
  height = 600,
  interactive = true
}: NetworkVisualizationProps) {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [isDragging, setIsDragging] = useState(false)
  const [dragNode, setDragNode] = useState<string | null>(null)
  
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Generate network data from relationships
  useEffect(() => {
    const nodeMap = new Map<string, Node>()
    const edgeList: Edge[] = []

    // Create nodes for businesses and people
    relationships.forEach((rel) => {
      // Business node
      if (!nodeMap.has(rel.business_name)) {
        nodeMap.set(rel.business_name, {
          id: rel.business_name,
          name: rel.business_name,
          type: 'business',
          x: Math.random() * 800 + 100,
          y: Math.random() * 400 + 100,
          size: 20,
          color: getNodeColor('business', rel.trust_level),
          connections: 0,
          relationship: rel
        })
      }

      // Person node
      if (!nodeMap.has(rel.contact_person)) {
        nodeMap.set(rel.contact_person, {
          id: rel.contact_person,
          name: rel.contact_person,
          type: 'person',
          x: Math.random() * 800 + 100,
          y: Math.random() * 400 + 100,
          size: 15,
          color: getNodeColor('person'),
          connections: 0
        })
      }

      // Create edge between business and person
      edgeList.push({
        source: rel.business_name,
        target: rel.contact_person,
        strength: getConnectionStrength(rel.connection_strength),
        type: rel.relationship_type
      })

      // Update connection counts
      const businessNode = nodeMap.get(rel.business_name)!
      const personNode = nodeMap.get(rel.contact_person)!
      businessNode.connections++
      personNode.connections++
    })

    // Adjust node sizes based on connections
    nodeMap.forEach((node) => {
      node.size = Math.max(10, Math.min(40, 10 + node.connections * 3))
    })

    setNodes(Array.from(nodeMap.values()))
    setEdges(edgeList)
  }, [relationships])

  const getNodeColor = (type: string, trustLevel?: string) => {
    if (type === 'business') {
      switch (trustLevel) {
        case 'high': return '#10B981' // green
        case 'verified': return '#3B82F6' // blue
        case 'medium': return '#F59E0B' // yellow
        default: return '#6B7280' // gray
      }
    } else if (type === 'person') {
      return '#8B5CF6' // purple
    }
    return '#6B7280'
  }

  const getConnectionStrength = (strength: string) => {
    switch (strength) {
      case 'strong': return 3
      case 'moderate': return 2
      case 'weak': return 1
      case 'dormant': return 0.5
      default: return 1
    }
  }

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId)
    onNodeSelect?.(nodeId)
  }

  const handleNodeHover = (nodeId: string | null) => {
    setHoveredNode(nodeId)
    onNodeHover?.(nodeId)
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.5))
  }

  const handleReset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
    setSelectedNode(null)
  }

  const filteredNodes = nodes.filter(node => {
    const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || node.type === filterType
    return matchesSearch && matchesFilter
  })

  const filteredEdges = edges.filter(edge => {
    const sourceVisible = filteredNodes.some(n => n.id === edge.source)
    const targetVisible = filteredNodes.some(n => n.id === edge.target)
    return sourceVisible && targetVisible
  })

  return (
    <div className="network-visualization bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Business Network</h3>
            <p className="text-sm text-gray-600">
              {nodes.length} connections • {edges.length} relationships
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomIn}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search network..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="all">All Types</option>
            <option value="business">Businesses</option>
            <option value="person">People</option>
          </select>
        </div>
      </div>

      {/* Network Visualization */}
      <div 
        ref={containerRef}
        className="relative overflow-hidden"
        style={{ height }}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          className="cursor-move"
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`
          }}
        >
          {/* Edges */}
          <g className="edges">
            {filteredEdges.map((edge, index) => {
              const sourceNode = filteredNodes.find(n => n.id === edge.source)
              const targetNode = filteredNodes.find(n => n.id === edge.target)
              
              if (!sourceNode || !targetNode) return null

              const isHighlighted = selectedNode === edge.source || selectedNode === edge.target
              
              return (
                <line
                  key={index}
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={isHighlighted ? '#3B82F6' : '#E5E7EB'}
                  strokeWidth={edge.strength}
                  opacity={isHighlighted ? 0.8 : 0.3}
                  className="transition-all duration-200"
                />
              )
            })}
          </g>

          {/* Nodes */}
          <g className="nodes">
            {filteredNodes.map((node) => {
              const isSelected = selectedNode === node.id
              const isHovered = hoveredNode === node.id
              const isHighlighted = isSelected || isHovered

              return (
                <g key={node.id}>
                  {/* Node circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size}
                    fill={node.color}
                    stroke={isHighlighted ? '#3B82F6' : '#FFFFFF'}
                    strokeWidth={isHighlighted ? 3 : 2}
                    opacity={isHighlighted ? 1 : 0.8}
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => handleNodeClick(node.id)}
                    onMouseEnter={() => handleNodeHover(node.id)}
                    onMouseLeave={() => handleNodeHover(null)}
                  />
                  
                  {/* Node label */}
                  <text
                    x={node.x}
                    y={node.y + node.size + 15}
                    textAnchor="middle"
                    fontSize="12"
                    fill={isHighlighted ? '#1F2937' : '#6B7280'}
                    fontWeight={isHighlighted ? 'bold' : 'normal'}
                    className="pointer-events-none transition-all duration-200"
                  >
                    {node.name.length > 15 ? `${node.name.substring(0, 15)}...` : node.name}
                  </text>

                  {/* Connection count badge */}
                  {node.connections > 1 && (
                    <circle
                      cx={node.x + node.size - 5}
                      cy={node.y - node.size + 5}
                      r="8"
                      fill="#DC2626"
                      className="pointer-events-none"
                    />
                  )}
                  {node.connections > 1 && (
                    <text
                      x={node.x + node.size - 5}
                      y={node.y - node.size + 9}
                      textAnchor="middle"
                      fontSize="10"
                      fill="white"
                      fontWeight="bold"
                      className="pointer-events-none"
                    >
                      {node.connections}
                    </text>
                  )}
                </g>
              )
            })}
          </g>
        </svg>

        {/* Node Details Panel */}
        {selectedNode && (
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-xs">
            {(() => {
              const node = nodes.find(n => n.id === selectedNode)
              if (!node) return null

              return (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{node.name}</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Type:</strong> {node.type}</p>
                    <p><strong>Connections:</strong> {node.connections}</p>
                    {node.relationship && (
                      <>
                        <p><strong>Trust Level:</strong> {node.relationship.trust_level}</p>
                        <p><strong>Relationship:</strong> {node.relationship.relationship_type.replace('_', ' ')}</p>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="mt-3 text-xs text-blue-600 hover:text-blue-700"
                  >
                    Close
                  </button>
                </div>
              )
            })()}
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <h5 className="font-medium text-gray-900 mb-3">Legend</h5>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500" />
              <span>High Trust</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500" />
              <span>Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500" />
              <span>Medium Trust</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-purple-500" />
              <span>Person</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}