import React, { useEffect, useId, useMemo, useRef, useState } from 'react'

export type ArchGraphNodeKind = 'client' | 'cp' | 'store' | 'agent' | 'default'
export type ArchGraphEdgeKind = 'solid' | 'dashed'

export interface ArchGraphNode {
  id: string
  title: string
  subtitle?: string
  kind?: ArchGraphNodeKind
  /** Закрепить узел в стартовой точке симуляции. */
  fixed?: boolean
  x?: number
  y?: number
}

export interface ArchGraphEdge {
  from: string
  to: string
  label?: string
  kind?: ArchGraphEdgeKind
  bidir?: boolean
}

export interface ArchGraphProps {
  width?: number
  height?: number
  nodes: ArchGraphNode[]
  edges: ArchGraphEdge[]
  ariaLabel?: string
  /** Длина пружины ребра. */
  linkDistance?: number
  /** Сила отталкивания между узлами. */
  charge?: number
  /** Радиус узла для коллизий. */
  collideRadius?: number
}

const NODE_FILL: Record<ArchGraphNodeKind, string> = {
  client: 'url(#agGradClient)',
  cp: 'url(#agGradCp)',
  store: 'url(#agGradStore)',
  agent: 'url(#agGradAgent)',
  default: 'url(#agGradCp)',
}

const NODE_STROKE: Record<ArchGraphNodeKind, string> = {
  client: '#1971c2',
  cp: '#0ca678',
  store: '#6f42c1',
  agent: '#d9480f',
  default: '#0ca678',
}

const NODE_W = 170
const NODE_H = 56

interface SimNode {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  fixed: boolean
  data: ArchGraphNode
}

interface SimEdge {
  source: SimNode
  target: SimNode
  data: ArchGraphEdge
}

/** Найти точку пересечения отрезка от center до far с прямоугольником узла (NODE_W × NODE_H). */
function nodeBorderPoint(node: SimNode, towardX: number, towardY: number): { x: number; y: number } {
  const halfW = NODE_W / 2
  const halfH = NODE_H / 2
  const dx = towardX - node.x
  const dy = towardY - node.y
  if (dx === 0 && dy === 0) return { x: node.x, y: node.y }
  const tx = dx === 0 ? Infinity : halfW / Math.abs(dx)
  const ty = dy === 0 ? Infinity : halfH / Math.abs(dy)
  const t = Math.min(tx, ty)
  return { x: node.x + dx * t, y: node.y + dy * t }
}

export const ArchGraph: React.FC<ArchGraphProps> = ({
  width = 900,
  height = 560,
  nodes,
  edges,
  ariaLabel = 'Граф связей ресурсов',
  linkDistance = 180,
  charge = 6000,
  collideRadius = 110,
}) => {
  const id = useId().replace(/[:]/g, '_')
  const inlineId = `arch-graph-${id}`
  const svgRef = useRef<SVGSVGElement>(null)

  const initialNodes = useMemo<SimNode[]>(() => {
    const cx = width / 2
    const cy = height / 2
    const r = Math.min(width, height) * 0.32
    return nodes.map((n, i) => {
      const angle = (i / nodes.length) * Math.PI * 2
      return {
        id: n.id,
        x: n.x ?? cx + Math.cos(angle) * r,
        y: n.y ?? cy + Math.sin(angle) * r,
        vx: 0,
        vy: 0,
        fixed: !!n.fixed,
        data: n,
      }
    })
  }, [nodes, width, height])

  const [simNodes, setSimNodes] = useState<SimNode[]>(initialNodes)
  const dragRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null)

  const simEdges = useMemo<SimEdge[]>(() => {
    const map = new Map<string, SimNode>()
    for (const n of simNodes) map.set(n.id, n)
    return edges
      .map(e => {
        const source = map.get(e.from)
        const target = map.get(e.to)
        if (!source || !target) return null
        return { source, target, data: e }
      })
      .filter((x): x is SimEdge => x !== null)
  }, [edges, simNodes])

  // Запуск физической симуляции (только в браузере)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const ITER = 400
    const damping = 0.85
    const cx = width / 2
    const cy = height / 2

    const work: SimNode[] = initialNodes.map(n => ({ ...n }))
    const map = new Map<string, SimNode>()
    for (const n of work) map.set(n.id, n)
    const links = edges
      .map(e => {
        const s = map.get(e.from)
        const t = map.get(e.to)
        return s && t ? { s, t } : null
      })
      .filter((x): x is { s: SimNode; t: SimNode } => x !== null)

    for (let step = 0; step < ITER; step++) {
      // отталкивание (charge)
      for (let i = 0; i < work.length; i++) {
        for (let j = i + 1; j < work.length; j++) {
          const a = work[i]
          const b = work[j]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const distSq = Math.max(dx * dx + dy * dy, 100)
          const dist = Math.sqrt(distSq)
          const f = charge / distSq
          const fx = (dx / dist) * f
          const fy = (dy / dist) * f
          if (!a.fixed) {
            a.vx -= fx
            a.vy -= fy
          }
          if (!b.fixed) {
            b.vx += fx
            b.vy += fy
          }
        }
      }
      // пружины (links)
      for (const { s, t } of links) {
        const dx = t.x - s.x
        const dy = t.y - s.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const diff = dist - linkDistance
        const k = 0.04
        const fx = (dx / dist) * diff * k
        const fy = (dy / dist) * diff * k
        if (!s.fixed) {
          s.vx += fx
          s.vy += fy
        }
        if (!t.fixed) {
          t.vx -= fx
          t.vy -= fy
        }
      }
      // коллизии
      for (let i = 0; i < work.length; i++) {
        for (let j = i + 1; j < work.length; j++) {
          const a = work[i]
          const b = work[j]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const minDist = collideRadius
          if (dist < minDist) {
            const overlap = (minDist - dist) / 2
            const ox = (dx / dist) * overlap
            const oy = (dy / dist) * overlap
            if (!a.fixed) {
              a.x -= ox
              a.y -= oy
            }
            if (!b.fixed) {
              b.x += ox
              b.y += oy
            }
          }
        }
      }
      // центрирующая
      for (const n of work) {
        if (n.fixed) continue
        n.vx += (cx - n.x) * 0.005
        n.vy += (cy - n.y) * 0.005
        n.vx *= damping
        n.vy *= damping
        n.x += n.vx
        n.y += n.vy
        // удержать в области
        n.x = Math.max(NODE_W / 2 + 8, Math.min(width - NODE_W / 2 - 8, n.x))
        n.y = Math.max(NODE_H / 2 + 8, Math.min(height - NODE_H / 2 - 8, n.y))
      }
    }
    setSimNodes(work)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Drag-and-drop
  const handlePointerDown = (e: React.PointerEvent, n: SimNode) => {
    if (!svgRef.current) return
    const pt = clientToSvg(svgRef.current, e.clientX, e.clientY)
    dragRef.current = { id: n.id, offsetX: pt.x - n.x, offsetY: pt.y - n.y }
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current || !svgRef.current) return
    const pt = clientToSvg(svgRef.current, e.clientX, e.clientY)
    const id = dragRef.current.id
    setSimNodes(prev =>
      prev.map(n =>
        n.id === id
          ? { ...n, x: pt.x - dragRef.current!.offsetX, y: pt.y - dragRef.current!.offsetY }
          : n,
      ),
    )
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragRef.current) return
    ;(e.target as Element).releasePointerCapture?.(e.pointerId)
    dragRef.current = null
  }

  const renderSvg = (className: string, interactive: boolean) => (
    <svg
      ref={interactive ? svgRef : undefined}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label={ariaLabel}
      onPointerMove={interactive ? handlePointerMove : undefined}
      onPointerUp={interactive ? handlePointerUp : undefined}
    >
      <defs>
        <marker
          id={`agArr-${id}`}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
        </marker>
        <linearGradient id="agGradClient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e7f5ff" />
          <stop offset="1" stopColor="#d0ebff" />
        </linearGradient>
        <linearGradient id="agGradCp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e6fcf5" />
          <stop offset="1" stopColor="#c3fae8" />
        </linearGradient>
        <linearGradient id="agGradStore" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3f0ff" />
          <stop offset="1" stopColor="#e5dbff" />
        </linearGradient>
        <linearGradient id="agGradAgent" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff4e6" />
          <stop offset="1" stopColor="#ffe8cc" />
        </linearGradient>
      </defs>

      {simEdges.map((edge, i) => {
        const p1 = nodeBorderPoint(edge.source, edge.target.x, edge.target.y)
        const p2 = nodeBorderPoint(edge.target, edge.source.x, edge.source.y)
        const dashed = edge.data.kind === 'dashed'
        const midX = (p1.x + p2.x) / 2
        const midY = (p1.y + p2.y) / 2
        return (
          <g key={`edge-${i}`}>
            <line
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              className={`arch-graph__edge${dashed ? ' arch-graph__edge--dashed' : ''}`}
              markerEnd={`url(#agArr-${id})`}
              markerStart={edge.data.bidir ? `url(#agArr-${id})` : undefined}
            />
            {edge.data.label && (
              <text
                x={midX}
                y={midY}
                className={`arch-graph__edge-label${dashed ? ' arch-graph__edge-label--alt' : ''}`}
                textAnchor="middle"
              >
                {edge.data.label}
              </text>
            )}
          </g>
        )
      })}

      {simNodes.map(n => {
        const kind = n.data.kind ?? 'default'
        return (
          <g
            key={n.id}
            transform={`translate(${n.x},${n.y})`}
            className="arch-graph__node"
            onPointerDown={interactive ? e => handlePointerDown(e, n) : undefined}
            style={interactive ? { cursor: 'grab' } : undefined}
          >
            <rect
              x={-NODE_W / 2}
              y={-NODE_H / 2}
              width={NODE_W}
              height={NODE_H}
              rx={8}
              fill={NODE_FILL[kind]}
              stroke={NODE_STROKE[kind]}
            />
            <text x={0} y={n.data.subtitle ? -4 : 4} textAnchor="middle" className="arch-graph__title">
              {n.data.title}
            </text>
            {n.data.subtitle && (
              <text x={0} y={14} textAnchor="middle" className="arch-graph__sub">
                {n.data.subtitle}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )

  return (
    <div className="arch-svg-wrap arch-graph-wrap">
      <a
        href={`#${inlineId}`}
        data-fancybox=""
        data-src={`#${inlineId}`}
        data-type="inline"
        className="arch-svg__zoom"
        aria-label="Развернуть граф"
        onClick={e => {
          // не открывать модалку при перетаскивании
          if (dragRef.current) e.preventDefault()
        }}
      >
        {renderSvg('arch-svg arch-graph', true)}
        <span className="arch-svg__zoom-hint" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path
              d="M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-3-8h6m-3-3v6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          увеличить · потяните узел
        </span>
      </a>
      <div id={inlineId} className="arch-svg__inline" style={{ display: 'none' }}>
        {renderSvg('arch-svg arch-svg--zoomed arch-graph', false)}
      </div>
    </div>
  )
}

function clientToSvg(svg: SVGSVGElement, clientX: number, clientY: number): { x: number; y: number } {
  const ctm = svg.getScreenCTM()
  if (!ctm) return { x: clientX, y: clientY }
  const pt = svg.createSVGPoint()
  pt.x = clientX
  pt.y = clientY
  const transformed = pt.matrixTransform(ctm.inverse())
  return { x: transformed.x, y: transformed.y }
}
