import React, { useId } from 'react'

export type ArchNodeKind = 'client' | 'cp' | 'store' | 'agent' | 'default'
export type ArchEdgeKind = 'solid' | 'dashed'

export interface ArchNode {
  id: string
  col: number
  row: number
  colSpan?: number
  rowSpan?: number
  title: string
  subtitle?: string
  extra?: string
  kind?: ArchNodeKind
}

export interface ArchEdge {
  from: string
  to: string
  label?: string
  kind?: ArchEdgeKind
  bidir?: boolean
  /** 'h-v' идет сначала горизонтально, 'v-h' — сначала вертикально. По умолчанию 'h-v'. */
  routing?: 'h-v' | 'v-h'
  /** Сдвиг параллельных стрелок: 0 — основная, ±1, ±2 — смещение. */
  lane?: number
}

export interface ArchGroup {
  id: string
  title?: string
  nodeIds: string[]
  /** Принудительный отступ внутри bbox-группы. */
  padding?: number
}

export interface ArchSvgProps {
  cols: number
  rows: number
  cellWidth?: number
  cellHeight?: number
  hGap?: number
  vGap?: number
  paddingX?: number
  paddingY?: number
  groups?: ArchGroup[]
  nodes: ArchNode[]
  edges: ArchEdge[]
  ariaLabel?: string
}

const NODE_FILL: Record<ArchNodeKind, string> = {
  client: 'url(#archGradClient)',
  cp: 'url(#archGradCp)',
  store: 'url(#archGradStore)',
  agent: 'url(#archGradAgent)',
  default: 'url(#archGradCp)',
}

const NODE_STROKE: Record<ArchNodeKind, string> = {
  client: '#1971c2',
  cp: '#0ca678',
  store: '#6f42c1',
  agent: '#d9480f',
  default: '#0ca678',
}

const LANE_OFFSET = 26
const GROUP_PADDING = 18

interface NodeBox {
  id: string
  x: number
  y: number
  w: number
  h: number
  cx: number
  cy: number
  node: ArchNode
}

export const ArchSvg: React.FC<ArchSvgProps> = ({
  cols,
  rows,
  cellWidth = 200,
  cellHeight = 80,
  hGap = 90,
  vGap = 60,
  paddingX = 30,
  paddingY = 60,
  groups,
  nodes,
  edges,
  ariaLabel = 'Архитектурная диаграмма',
}) => {
  const colX = (col: number): number => paddingX + col * (cellWidth + hGap)
  const rowY = (row: number): number => paddingY + row * (cellHeight + vGap)

  const totalWidth = paddingX * 2 + cols * cellWidth + (cols - 1) * hGap
  const totalHeight = paddingY + rows * cellHeight + (rows - 1) * vGap + 30

  const nodeMap = new Map<string, NodeBox>()
  for (const n of nodes) {
    const colSpan = n.colSpan ?? 1
    const rowSpan = n.rowSpan ?? 1
    const x = colX(n.col)
    const y = rowY(n.row)
    const w = cellWidth * colSpan + hGap * (colSpan - 1)
    const h = cellHeight * rowSpan + vGap * (rowSpan - 1)
    nodeMap.set(n.id, { id: n.id, x, y, w, h, cx: x + w / 2, cy: y + h / 2, node: n })
  }

  const buildPath = (e: ArchEdge): { d: string; labelX: number; labelY: number } => {
    const a = nodeMap.get(e.from)
    const b = nodeMap.get(e.to)
    if (!a || !b) return { d: '', labelX: 0, labelY: 0 }
    const lane = e.lane ?? 0
    const laneShift = lane * LANE_OFFSET

    const sameCol = a.node.col === b.node.col
    const sameRow = a.node.row === b.node.row

    const labelOffset = lane > 0 ? 16 : -10

    const clampX = (x: number, box: NodeBox): number =>
      Math.min(Math.max(x, box.x + 8), box.x + box.w - 8)
    const clampY = (y: number, box: NodeBox): number =>
      Math.min(Math.max(y, box.y + 8), box.y + box.h - 8)

    if (sameCol && !sameRow) {
      const goingDown = b.y > a.y
      const sxRaw = a.cx + laneShift
      const sx = clampX(sxRaw, a)
      const sy = goingDown ? a.y + a.h : a.y
      const tx = clampX(sxRaw, b)
      const ty = goingDown ? b.y : b.y + b.h
      const d = sx === tx ? `M${sx},${sy} V${ty}` : `M${sx},${sy} V${(sy + ty) / 2} H${tx} V${ty}`
      return { d, labelX: sx + (lane >= 0 ? 14 : -14), labelY: (sy + ty) / 2 }
    }
    if (sameRow && !sameCol) {
      const goingRight = b.x > a.x
      const syRaw = a.cy + laneShift
      const sx = goingRight ? a.x + a.w : a.x
      const sy = clampY(syRaw, a)
      const tx = goingRight ? b.x : b.x + b.w
      const ty = clampY(syRaw, b)
      const d = sy === ty ? `M${sx},${sy} H${tx}` : `M${sx},${sy} H${(sx + tx) / 2} V${ty} H${tx}`
      return { d, labelX: (sx + tx) / 2, labelY: sy + labelOffset }
    }
    if (sameCol && sameRow) {
      return { d: '', labelX: 0, labelY: 0 }
    }

    const routing = e.routing ?? 'h-v'
    const goingRight = b.x > a.x
    const goingDown = b.y > a.y

    if (routing === 'h-v') {
      const syRaw = a.cy + laneShift
      const sx = goingRight ? a.x + a.w : a.x
      const sy = clampY(syRaw, a)
      const txRaw = b.cx + laneShift
      const tx = clampX(txRaw, b)
      const ty = goingDown ? b.y : b.y + b.h
      return { d: `M${sx},${sy} H${tx} V${ty}`, labelX: (sx + tx) / 2, labelY: sy + labelOffset }
    } else {
      const sxRaw = a.cx + laneShift
      const sx = clampX(sxRaw, a)
      const sy = goingDown ? a.y + a.h : a.y
      const tx = goingRight ? b.x : b.x + b.w
      const tyRaw = b.cy + laneShift
      const ty = clampY(tyRaw, b)
      return { d: `M${sx},${sy} V${ty} H${tx}`, labelX: sx + (lane >= 0 ? 14 : -14), labelY: (sy + ty) / 2 }
    }
  }

  const reactId = useId()
  const inlineId = `arch-svg-${reactId.replace(/[:]/g, '_')}`

  const groupBoxes = (groups ?? []).map(g => {
    const padding = g.padding ?? GROUP_PADDING
    const members = g.nodeIds
      .map(id => nodeMap.get(id))
      .filter((b): b is NodeBox => Boolean(b))
    if (members.length === 0) return null
    const minX = Math.min(...members.map(b => b.x)) - padding
    const minY = Math.min(...members.map(b => b.y)) - padding
    const maxX = Math.max(...members.map(b => b.x + b.w)) + padding
    const maxY = Math.max(...members.map(b => b.y + b.h)) + padding
    return { id: g.id, title: g.title, x: minX, y: minY, w: maxX - minX, h: maxY - minY }
  })

  const renderSvg = (className: string) => (
    <svg
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      className={className}
      role="img"
      aria-label={ariaLabel}
    >
        <defs>
          <marker
            id="archArr"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
          </marker>
          <linearGradient id="archGradClient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e7f5ff" />
            <stop offset="1" stopColor="#d0ebff" />
          </linearGradient>
          <linearGradient id="archGradCp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e6fcf5" />
            <stop offset="1" stopColor="#c3fae8" />
          </linearGradient>
          <linearGradient id="archGradStore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f3f0ff" />
            <stop offset="1" stopColor="#e5dbff" />
          </linearGradient>
          <linearGradient id="archGradAgent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff4e6" />
            <stop offset="1" stopColor="#ffe8cc" />
          </linearGradient>
        </defs>

        {groupBoxes.map(g => g && (
          <g key={`group-${g.id}`} className="arch-svg__group">
            <rect
              x={g.x}
              y={g.y}
              width={g.w}
              height={g.h}
              rx={10}
              className="arch-svg__group-rect"
            />
            {g.title && (
              <>
                <rect
                  x={g.x + 12}
                  y={g.y - 12}
                  width={Math.max(80, g.title.length * 8 + 16)}
                  height={22}
                  rx={4}
                  className="arch-svg__group-title-bg"
                />
                <text
                  x={g.x + 20}
                  y={g.y + 4}
                  className="arch-svg__group-title"
                >
                  {g.title}
                </text>
              </>
            )}
          </g>
        ))}

        {nodes.map(n => {
          const box = nodeMap.get(n.id)
          if (!box) return null
          const kind = n.kind ?? 'default'
          return (
            <g key={n.id} className="arch-svg__node">
              <rect
                x={box.x}
                y={box.y}
                width={box.w}
                height={box.h}
                rx={8}
                fill={NODE_FILL[kind]}
                stroke={NODE_STROKE[kind]}
              />
              <text
                x={box.cx}
                y={box.y + (n.subtitle ? 28 : box.h / 2 + 5)}
                textAnchor="middle"
                className="arch-svg__title"
              >
                {n.title}
              </text>
              {n.subtitle && (
                <text
                  x={box.cx}
                  y={box.y + 50}
                  textAnchor="middle"
                  className="arch-svg__sub"
                >
                  {n.subtitle}
                </text>
              )}
              {n.extra && (
                <text
                  x={box.cx}
                  y={box.y + 68}
                  textAnchor="middle"
                  className="arch-svg__sub"
                >
                  {n.extra}
                </text>
              )}
            </g>
          )
        })}

        {edges.map((e, i) => {
          const { d, labelX, labelY } = buildPath(e)
          if (!d) return null
          const dashed = e.kind === 'dashed'
          return (
            <g key={`edge-${i}`}>
              <path
                d={d}
                className={`arch-svg__edge${dashed ? ' arch-svg__edge--dashed' : ''}`}
                markerEnd="url(#archArr)"
                markerStart={e.bidir ? 'url(#archArr)' : undefined}
              />
              {e.label && (
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  className={`arch-svg__edge-label${dashed ? ' arch-svg__edge-label--alt' : ''}`}
                >
                  {e.label}
                </text>
              )}
            </g>
          )
        })}
    </svg>
  )

  return (
    <div className="arch-svg-wrap">
      <a
        href={`#${inlineId}`}
        data-fancybox=""
        data-src={`#${inlineId}`}
        data-type="inline"
        className="arch-svg__zoom"
        aria-label="Развернуть архитектурную схему"
      >
        {renderSvg('arch-svg')}
        <span className="arch-svg__zoom-hint" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-3-8h6m-3-3v6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          увеличить
        </span>
      </a>
      <div id={inlineId} className="arch-svg__inline" style={{ display: 'none' }}>
        {renderSvg('arch-svg arch-svg--zoomed')}
      </div>
    </div>
  )
}
