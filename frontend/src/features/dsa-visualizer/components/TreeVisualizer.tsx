import React from 'react'
import { motion } from 'framer-motion'

interface TreeNodeData {
  id: string
  value: string | number
  left?: string | null
  right?: string | null
  highlighted?: boolean
  color?: string
}

interface TreeVisualizerProps {
  nodes: TreeNodeData[]
  visitedOrder?: string[]
  currentNodeId?: string
  className?: string
}

interface LayoutNode {
  data: TreeNodeData
  x: number
  y: number
}

interface TreeEdge {
  from: { x: number; y: number }
  to: { x: number; y: number }
}

function buildTreeLayout(
  nodes: TreeNodeData[],
  nodeMap: Map<string, TreeNodeData>,
): { layoutNodes: LayoutNode[]; edges: TreeEdge[] } {
  if (nodes.length === 0) return { layoutNodes: [], edges: [] }

  const layoutNodes: LayoutNode[] = []
  const edges: TreeEdge[] = []

  const NODE_W = 48
  const NODE_H = 48
  const H_GAP = 40
  const V_GAP = 72

  function assignX(
    nodeId: string,
    depth: number,
    leftBound: number,
  ): { center: number; width: number } {
    const node = nodeMap.get(nodeId)
    if (!node) return { center: leftBound + NODE_W / 2, width: NODE_W }

    let leftWidth = 0
    let rightWidth = 0
    let leftCenter = 0
    let rightCenter = 0

    if (node.left && nodeMap.has(node.left)) {
      const res = assignX(node.left, depth + 1, leftBound)
      leftWidth = res.width
      leftCenter = res.center
    }
    if (node.right && nodeMap.has(node.right)) {
      const res = assignX(node.right, depth + 1, leftBound + leftWidth + H_GAP)
      rightWidth = res.width
      rightCenter = res.center
    }

    const totalWidth = leftWidth + rightWidth + (leftWidth > 0 && rightWidth > 0 ? H_GAP : 0)
    const thisLeft = leftBound + Math.max(0, (totalWidth - NODE_W) / 2)
    const cx = thisLeft + NODE_W / 2

    layoutNodes.push({
      data: node,
      x: cx,
      y: depth * V_GAP + 30,
    })

    if (node.left && nodeMap.has(node.left)) {
      edges.push({
        from: { x: cx, y: depth * V_GAP + 30 + NODE_H / 2 },
        to: { x: leftCenter, y: (depth + 1) * V_GAP + 30 - NODE_H / 2 },
      })
    }
    if (node.right && nodeMap.has(node.right)) {
      edges.push({
        from: { x: cx, y: depth * V_GAP + 30 + NODE_H / 2 },
        to: { x: rightCenter, y: (depth + 1) * V_GAP + 30 - NODE_H / 2 },
      })
    }

    return { center: cx, width: totalWidth || NODE_W }
  }

  const root = nodes[0]
  if (root) {
    assignX(root.id, 0, 0)
  }

  return { layoutNodes, edges }
}

const TreeVisualizer: React.FC<TreeVisualizerProps> = ({
  nodes,
  visitedOrder,
  currentNodeId,
  className,
}) => {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]))
  const visitedSet = new Set(visitedOrder ?? [])
  const { layoutNodes, edges } = buildTreeLayout(nodes, nodeMap)

  const svgW = Math.max(400, ...layoutNodes.map((n) => n.x + 60))
  const svgH = Math.max(300, ...layoutNodes.map((n) => n.y + 60))

  return (
    <div className={className} style={{ display: 'flex', justifyContent: 'center' }}>
      <svg width={svgW} height={svgH} style={{ overflow: 'visible' }}>
        {edges.map((edge, i) => (
          <motion.line
            key={`edge-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            x1={edge.from.x}
            y1={edge.from.y}
            x2={edge.to.x}
            y2={edge.to.y}
            stroke="#D1D5DB"
            strokeWidth={2}
          />
        ))}

        {layoutNodes.map((ln) => {
          const isVisited = visitedSet.has(ln.data.id)
          const isCurrent = ln.data.id === currentNodeId
          const isHighlighted = ln.data.highlighted || isCurrent

          return (
            <g key={ln.data.id}>
              <motion.circle
                initial={{ opacity: 0, r: 0 }}
                animate={{
                  opacity: 1,
                  r: 22,
                  cx: ln.x,
                  cy: ln.y,
                  fill: isCurrent
                    ? '#EFF6FF'
                    : isVisited
                    ? '#F0FDF4'
                    : '#FFFFFF',
                  stroke: isCurrent
                    ? '#3B82F6'
                    : isVisited
                    ? '#22C55E'
                    : ln.data.color ?? '#6B7280',
                  strokeWidth: isHighlighted ? 3 : 2,
                }}
                transition={{ duration: 0.35, delay: 0.05 }}
                style={{
                  filter: isCurrent
                    ? 'drop-shadow(0 0 8px rgba(59,130,246,0.5))'
                    : isVisited
                    ? 'drop-shadow(0 0 6px rgba(34,197,94,0.4))'
                    : undefined,
                }}
              />
              <motion.text
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                x={ln.x}
                y={ln.y + 1}
                textAnchor="middle"
                dominantBaseline="central"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  fill: isCurrent ? '#1D4ED8' : isVisited ? '#15803D' : '#1F2937',
                  pointerEvents: 'none',
                }}
              >
                {String(ln.data.value)}
              </motion.text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default TreeVisualizer
