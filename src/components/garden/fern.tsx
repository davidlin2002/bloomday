import { motion } from 'framer-motion'
import type { PlantProps } from './plant-types'
import { getBloomHeight } from './plant-types'

const spring = { type: 'spring' as const, damping: 12, stiffness: 100 }

export default function Fern({ stage, difficulty, progress = 1 }: PlantProps) {
  const h = getBloomHeight(difficulty)

  if (stage === 'seed') {
    return (
      <g>
        <ellipse cx="0" cy="-2" rx="7" ry="4" fill="#8B7E6A" opacity="0.5" />
        <circle cx="0" cy="-5" r="2" fill="#6B8C3F" opacity="0.5" />
      </g>
    )
  }

  if (stage === 'sprout') {
    const stemH = 28 * progress
    return (
      <g>
        <ellipse cx="0" cy="-2" rx="7" ry="4" fill="#8B7E6A" opacity="0.4" />
        <motion.line
          x1="0" y1="0" x2="0" y2={-stemH}
          stroke="#6B8C3F" strokeWidth="2" strokeLinecap="round"
          initial={{ y2: 0 }} animate={{ y2: -stemH }} transition={spring}
        />
        {/* Fronds unfurling */}
        <motion.ellipse
          cx="-6" cy={-stemH * 0.6} rx="4" ry="12"
          fill="#7A9B4A" opacity="0.5"
          transform={`rotate(-30 -6 ${-stemH * 0.6})`}
          initial={{ scale: 0 }} animate={{ scale: progress }} transition={spring}
        />
        <motion.ellipse
          cx="5" cy={-stemH * 0.7} rx="3.5" ry="10"
          fill="#8FB85A" opacity="0.45"
          transform={`rotate(25 5 ${-stemH * 0.7})`}
          initial={{ scale: 0 }} animate={{ scale: progress }} transition={{ ...spring, delay: 0.1 }}
        />
      </g>
    )
  }

  // bloom (fern = full foliage, no flower)
  const stemH = h * progress
  const frondCount = difficulty === 'hard' ? 6 : difficulty === 'medium' ? 5 : 3
  const fronds = Array.from({ length: frondCount }, (_, i) => {
    const side = i % 2 === 0 ? -1 : 1
    const yPos = -stemH * (0.3 + (i / frondCount) * 0.6)
    const angle = side * (20 + i * 5)
    const rx = 4 + (i % 3)
    const ry = 14 + (frondCount - i) * 2
    const colors = ['#6B8C3F', '#7A9B4A', '#8FB85A']
    return (
      <motion.ellipse
        key={i}
        cx={side * 7} cy={yPos} rx={rx} ry={ry}
        fill={colors[i % 3]} opacity={0.45 + (i % 3) * 0.05}
        transform={`rotate(${angle} ${side * 7} ${yPos})`}
        initial={{ scale: 0 }} animate={{ scale: progress }}
        transition={{ ...spring, delay: i * 0.06 }}
      />
    )
  })

  return (
    <g>
      <ellipse cx="0" cy="-2" rx="7" ry="4" fill="#8B7E6A" opacity="0.35" />
      <motion.line
        x1="0" y1="0" x2="0" y2={-stemH}
        stroke="#6B8C3F" strokeWidth="2.5" strokeLinecap="round"
        initial={{ y2: 0 }} animate={{ y2: -stemH }} transition={spring}
      />
      {fronds}
      {/* Top curl */}
      <motion.ellipse
        cx="0" cy={-stemH - 5} rx="5" ry="8"
        fill="#7A9B4A" opacity="0.5"
        initial={{ scale: 0 }} animate={{ scale: progress > 0.8 ? 1 : 0 }}
        transition={{ ...spring, delay: 0.3 }}
      />
    </g>
  )
}
