import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type NodeTypes,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  HeroNode,
  FeaturesNode,
  WhyNode,
  AudienceNode,
  HowNode,
  TestimonialNode,
  FaqNode,
  CtaNode,
} from './nodes'

const nodeTypes: NodeTypes = {
  hero: HeroNode,
  features: FeaturesNode,
  why: WhyNode,
  audience: AudienceNode,
  how: HowNode,
  testimonial: TestimonialNode,
  faq: FaqNode,
  cta: CtaNode,
}

const defaultNodes: Node[] = [
  { id: 'hero',        type: 'hero',        position: { x: 0, y: 0 },    data: {} },
  { id: 'features',    type: 'features',    position: { x: 0, y: 260 },  data: {} },
  { id: 'why',         type: 'why',         position: { x: -300, y: 540 }, data: {} },
  { id: 'audience',    type: 'audience',    position: { x: 280, y: 540 }, data: {} },
  { id: 'how',         type: 'how',         position: { x: 0, y: 820 },  data: {} },
  { id: 'testimonial', type: 'testimonial', position: { x: 0, y: 1100 }, data: {} },
  { id: 'faq',         type: 'faq',         position: { x: 0, y: 1380 }, data: {} },
  { id: 'cta',         type: 'cta',         position: { x: 0, y: 1660 }, data: {} },
]

const defaultEdges: Edge[] = [
  {
    id: 'e-hero-features',
    source: 'hero',
    target: 'features',
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'var(--color-primary)', strokeWidth: 2, opacity: 0.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--color-primary)' },
  },
  {
    id: 'e-features-why',
    source: 'features',
    target: 'why',
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'var(--color-primary)', strokeWidth: 2, opacity: 0.4 },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--color-primary)' },
  },
  {
    id: 'e-features-audience',
    source: 'features',
    target: 'audience',
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'var(--color-secondary)', strokeWidth: 2, opacity: 0.4 },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--color-secondary)' },
  },
  {
    id: 'e-why-how',
    source: 'why',
    target: 'how',
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'var(--color-primary)', strokeWidth: 2, opacity: 0.4 },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--color-primary)' },
  },
  {
    id: 'e-audience-how',
    source: 'audience',
    target: 'how',
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'var(--color-secondary)', strokeWidth: 2, opacity: 0.4 },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--color-secondary)' },
  },
  {
    id: 'e-how-testimonial',
    source: 'how',
    target: 'testimonial',
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'var(--color-primary)', strokeWidth: 2, opacity: 0.4 },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--color-primary)' },
  },
  {
    id: 'e-testimonial-faq',
    source: 'testimonial',
    target: 'faq',
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'var(--color-primary)', strokeWidth: 2, opacity: 0.4 },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--color-primary)' },
  },
  {
    id: 'e-faq-cta',
    source: 'faq',
    target: 'cta',
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'var(--color-primary)', strokeWidth: 2, opacity: 0.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--color-primary)' },
  },
]

export function HomeFlow() {
  const [nodes, , onNodesChange] = useNodesState(defaultNodes)
  const [edges, , onEdgesChange] = useEdgesState(defaultEdges)

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 64px)', paddingTop: 64, background: 'var(--color-bg-base)' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.3}
        maxZoom={1.5}
        panOnScroll
        selectionOnDrag
        panOnDrag={false}
        className="home-flow"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          style={{ background: 'var(--color-bg-base)' }}
        />
        <Controls
          showInteractive={false}
          style={{
            background: 'var(--color-surface-container)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 12,
            color: 'var(--color-on-surface)',
          }}
        />
        <MiniMap
          nodeStrokeColor="var(--color-primary)"
          nodeColor="var(--color-surface-container)"
          maskColor="rgba(0,0,0,0.6)"
          style={{
            background: 'var(--color-surface-container)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 12,
          }}
        />
      </ReactFlow>
    </div>
  )
}