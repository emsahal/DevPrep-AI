import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Step, AnimationEvent, QuestionData } from '@/features/dsa-visualizer/types'
import ArrayVisualizer from './ArrayVisualizer'
import LinkedListVisualizer from './LinkedListVisualizer'
import StackVisualizer from './StackVisualizer'
import QueueVisualizer from './QueueVisualizer'
import TreeVisualizer from './TreeVisualizer'
import HashMapVisualizer from './HashMapVisualizer'

interface VisualizationEngineProps {
  question: QuestionData
  currentStep: number
  onComplete?: () => void
}

interface VisState {
  arrayData: (number | string)[]
  highlightedIndices: number[]
  highlightGroups: { indices: number[]; color: string }[]
  pointerPositions: { index: number; label: string; color: string }[]
  swaps: { from: number; to: number } | undefined
  variables: Record<string, string | number>
  visitedNodes: string[]
  currentNodeId: string | undefined
  stackItems: (string | number)[]
  queueItems: (string | number)[]
  linkedListNodes: { value: string | number; id: string; highlighted?: boolean; color?: string }[]
  linkedListArrows: { from: string; to: string; label?: string; color?: string }[]
  linkedListHeadId: string | undefined
  hashMapEntries: { key: string | number; value: string | number; hash?: number; highlighted?: boolean }[]
  treeNodes: { id: string; value: string | number; left?: string | null; right?: string | null; highlighted?: boolean; color?: string }[]
  description: string
  why: string
  title: string
}

function initState(question: QuestionData): VisState {
  const input = question.inputExample ?? {}
  const arr = (input.array as (number | string)[]) ?? []

  let linkedListNodes: VisState['linkedListNodes'] = []
  let linkedListHeadId: string | undefined
  if (arr.length > 0) {
    linkedListNodes = arr.map((v, i) => ({
      value: v,
      id: `node-${i}`,
      highlighted: false,
    }))
    linkedListHeadId = 'node-0'
  }

  const treeNodes: VisState['treeNodes'] = []
  if (arr.length > 0) {
    for (let i = 0; i < arr.length; i++) {
      const leftIdx = 2 * i + 1
      const rightIdx = 2 * i + 2
      treeNodes.push({
        id: `tree-${i}`,
        value: arr[i],
        left: leftIdx < arr.length ? `tree-${leftIdx}` : null,
        right: rightIdx < arr.length ? `tree-${rightIdx}` : null,
      })
    }
  }

  let hashMapEntries: VisState['hashMapEntries'] = []
  if (input.object && typeof input.object === 'object') {
    hashMapEntries = Object.entries(input.object as Record<string, unknown>).map(([k, v]) => ({
      key: k,
      value: v as string | number,
    }))
  }

  const firstStep = question.steps[0]

  return {
    arrayData: [...arr],
    highlightedIndices: [],
    highlightGroups: [],
    pointerPositions: [],
    swaps: undefined,
    variables: {},
    visitedNodes: [],
    currentNodeId: undefined,
    stackItems: [...arr],
    queueItems: [...arr],
    linkedListNodes,
    linkedListArrows: [],
    linkedListHeadId,
    hashMapEntries,
    treeNodes,
    description: firstStep?.description ?? '',
    why: firstStep?.why ?? '',
    title: firstStep?.title ?? '',
  }
}

function resolveColor(c: string | undefined): string | undefined {
  const map: Record<string, string> = {
    blue: '#3B82F6',
    green: '#22C55E',
    yellow: '#EAB308',
    orange: '#F97316',
    red: '#EF4444',
    gray: '#6B7280',
  }
  return c ? (map[c] ?? c) : undefined
}

function applyAnimation(state: VisState, event: AnimationEvent): VisState {
  const s = { ...state }

  switch (event.type) {
    case 'highlight': {
      if (event.indices) {
        s.highlightedIndices = [...event.indices]
        s.highlightGroups = [
          ...s.highlightGroups,
          { indices: event.indices, color: event.color ?? 'blue' },
        ]
      } else if (event.index !== undefined) {
        s.highlightedIndices = [event.index]
        s.highlightGroups = [
          ...s.highlightGroups,
          { indices: [event.index], color: event.color ?? 'blue' },
        ]
      } else if (event.target) {
        const target = Array.isArray(event.target) ? event.target : [event.target]
        s.visitedNodes = [...new Set([...s.visitedNodes, ...target])]
      }
      break
    }

    case 'compare': {
      if (event.indices) {
        s.highlightGroups = s.highlightGroups.filter(
          (g) => JSON.stringify(g.indices) !== JSON.stringify(event.indices),
        )
        s.highlightGroups.push({
          indices: event.indices,
          color: event.color ?? 'yellow',
        })
      }
      break
    }

    case 'swap': {
      const from = Number(event.from)
      const to = Number(event.to)
      if (!isNaN(from) && !isNaN(to)) {
        s.swaps = { from, to }
        const arr = [...s.arrayData]
        const tmp = arr[from]
        arr[from] = arr[to]
        arr[to] = tmp
        s.arrayData = arr
      }
      break
    }

    case 'moveArrow': {
      if (event.index !== undefined) {
        s.pointerPositions = s.pointerPositions.filter(
          (p) => p.label !== (event.label ?? 'i'),
        )
        s.pointerPositions = [
          ...s.pointerPositions,
          {
            index: event.index,
            label: event.label ?? 'i',
            color: event.color ?? 'blue',
          },
        ]
      }
      break
    }

    case 'updateVariable':
    case 'showVariable': {
      if (event.label && event.value !== undefined) {
        s.variables = { ...s.variables, [event.label]: event.value as string | number }
      }
      break
    }

    case 'visitNode': {
      if (event.target) {
        const targets = Array.isArray(event.target) ? event.target : [event.target]
        s.visitedNodes = [...new Set([...s.visitedNodes, ...targets])]
      }
      if (event.index !== undefined) {
        const id = `tree-${event.index}`
        s.visitedNodes = [...new Set([...s.visitedNodes, id])]
        s.currentNodeId = id
      }
      break
    }

    case 'highlightNode': {
      if (event.target) {
        const targets = Array.isArray(event.target) ? event.target : [event.target]
        s.linkedListNodes = s.linkedListNodes.map((n) => ({
          ...n,
          highlighted: targets.includes(n.id) ? true : n.highlighted,
          color: targets.includes(n.id) ? resolveColor(event.color) : n.color,
        }))
      }
      break
    }

    case 'connectNodes': {
      if (event.from !== undefined && event.to !== undefined) {
        const fromId = typeof event.from === 'number' ? `node-${event.from}` : String(event.from)
        const toId = typeof event.to === 'number' ? `node-${event.to}` : String(event.to)
        s.linkedListArrows = [
          ...s.linkedListArrows,
          { from: fromId, to: toId, label: event.label, color: resolveColor(event.color) },
        ]
      }
      break
    }

    case 'disconnectNodes': {
      if (event.from !== undefined) {
        const fromId = typeof event.from === 'number' ? `node-${event.from}` : String(event.from)
        s.linkedListArrows = s.linkedListArrows.filter((a) => a.from !== fromId)
      }
      break
    }

    case 'push':
    case 'showStack': {
      if (event.value !== undefined) {
        s.stackItems = [...s.stackItems, event.value as string | number]
      }
      break
    }

    case 'pop': {
      s.stackItems = s.stackItems.slice(0, -1)
      break
    }

    case 'enqueue':
    case 'showQueue': {
      if (event.value !== undefined) {
        s.queueItems = [...s.queueItems, event.value as string | number]
      }
      break
    }

    case 'dequeue': {
      s.queueItems = s.queueItems.slice(1)
      break
    }

    case 'showTable': {
      if (event.value !== undefined && typeof event.value === 'object') {
        const vals = event.value as Record<string, unknown>
        s.hashMapEntries = Object.entries(vals).map(([k, v]) => ({
          key: k,
          value: v as string | number,
          highlighted: false,
        }))
      }
      if (event.data?.entries) {
        s.hashMapEntries = (event.data.entries as { key: string | number; value: string | number }[]).map(
          (e) => ({ ...e, highlighted: false }),
        )
      }
      break
    }

    case 'showText': {
      if (event.description) {
        s.description = event.description
      }
      break
    }

    case 'glow': {
      if (event.indices) {
        s.highlightGroups = [
          ...s.highlightGroups,
          { indices: event.indices, color: event.color ?? 'blue' },
        ]
      }
      break
    }

    case 'insert': {
      if (event.index !== undefined && event.value !== undefined) {
        const arr = [...s.arrayData]
        arr.splice(event.index, 0, event.value as string | number)
        s.arrayData = arr
      }
      break
    }

    case 'remove': {
      if (event.index !== undefined) {
        const arr = [...s.arrayData]
        arr.splice(event.index, 1)
        s.arrayData = arr
      }
      break
    }

    default:
      break
  }

  return s
}

const topicVisualizerMap: Record<string, string> = {
  'Arrays': 'array',
  'Searching': 'array',
  'Sorting': 'array',
  'Binary Search': 'array',
  'Two Pointers': 'array',
  'Sliding Window': 'array',
  'Linked List': 'linkedlist',
  'Stack': 'stack',
  'Queue': 'queue',
  'Trees': 'tree',
  'Binary Tree': 'tree',
  'Binary Search Tree': 'tree',
  'Heap': 'tree',
  'Graph': 'tree',
  'HashMap': 'hashmap',
  'Hash Table': 'hashmap',
  'DP': 'dp',
  'Dynamic Programming': 'dp',
  'Recursion': 'recursion',
}

function getVisualizerType(topic: string): string {
  return topicVisualizerMap[topic] ?? 'array'
}

const VisualizationEngine: React.FC<VisualizationEngineProps> = ({
  question,
  currentStep,
  onComplete,
}) => {
  const [visState, setVisState] = useState<VisState>(() => initState(question))

  const applyStep = useCallback((stepIndex: number) => {
    const step = question.steps[stepIndex]
    if (!step) return

    let newState = { ...visState }
    newState.title = step.title
    newState.description = step.description
    newState.why = step.why ?? ''
    newState.swaps = undefined
    newState.highlightGroups = []
    newState.highlightedIndices = []

    for (const event of step.animations) {
      newState = applyAnimation(newState, event)
    }

    setVisState(newState)
  }, [question.steps, visState])

  useEffect(() => {
    const timer = setTimeout(() => {
      applyStep(currentStep)
      if (currentStep >= question.steps.length - 1) {
        onComplete?.()
      }
    }, 200)
    return () => clearTimeout(timer)
  }, [currentStep, question.steps.length, onComplete, applyStep])

  const vizType = getVisualizerType(question.topic ?? question.title)

  const renderVisualizer = () => {
    switch (vizType) {
      case 'array':
      case 'dp':
        return (
          <ArrayVisualizer
            array={visState.arrayData}
            highlights={visState.highlightGroups.length > 0 ? visState.highlightGroups : undefined}
            pointers={visState.pointerPositions.length > 0 ? visState.pointerPositions : undefined}
            swaps={visState.swaps}
          />
        )

      case 'linkedlist':
        return (
          <LinkedListVisualizer
            nodes={visState.linkedListNodes}
            arrows={visState.linkedListArrows}
            headId={visState.linkedListHeadId}
          />
        )

      case 'stack':
        return (
          <StackVisualizer
            items={visState.stackItems}
            highlights={visState.highlightedIndices}
          />
        )

      case 'queue':
        return (
          <QueueVisualizer
            items={visState.queueItems}
            highlights={visState.highlightedIndices}
          />
        )

      case 'tree':
        return (
          <TreeVisualizer
            nodes={visState.treeNodes}
            visitedOrder={visState.visitedNodes}
            currentNodeId={visState.currentNodeId}
          />
        )

      case 'hashmap':
        return (
          <HashMapVisualizer
            entries={visState.hashMapEntries}
          />
        )

      case 'recursion':
        return (
          <StackVisualizer
            items={visState.stackItems}
            highlights={visState.highlightedIndices}
          />
        )

      default:
        return (
          <ArrayVisualizer
            array={visState.arrayData}
            highlights={visState.highlightGroups.length > 0 ? visState.highlightGroups : undefined}
            pointers={visState.pointerPositions.length > 0 ? visState.pointerPositions : undefined}
          />
        )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        padding: 24,
        background: '#FFFFFF',
        borderRadius: 12,
        border: '1px solid #E5E7EB',
        maxWidth: 900,
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <motion.h3
          key={visState.title}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' }}
        >
          {visState.title}
        </motion.h3>
        <motion.p
          key={visState.description}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          style={{ margin: 0, fontSize: 14, color: '#4B5563', lineHeight: 1.5 }}
        >
          {visState.description}
        </motion.p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', minHeight: 200 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`viz-${currentStep}`}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%' }}
          >
            {renderVisualizer()}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {Object.keys(visState.variables).length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              padding: 12,
              background: '#F9FAFB',
              borderRadius: 8,
              border: '1px solid #E5E7EB',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', width: '100%', marginBottom: 4 }}>
              Variables
            </span>
            {Object.entries(visState.variables).map(([key, val]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  background: '#EFF6FF',
                  border: '1px solid #93C5FD',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#1D4ED8',
                }}
              >
                {key} = {String(val)}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {visState.why && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            style={{
              padding: 12,
              borderRadius: 8,
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              fontSize: 13,
              color: '#92400E',
              lineHeight: 1.5,
            }}
          >
            <span style={{ fontWeight: 700 }}>Why? </span>
            {visState.why}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default VisualizationEngine
