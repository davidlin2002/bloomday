import { motion } from 'framer-motion'
import type { PlantProps } from './plant-types'
import { getBloomHeight } from './plant-types'

const spring = { type: 'spring' as const, damping: 12, stiffness: 100 }

export default function Herb({ stage, difficulty, progress = 1 }: PlantProps) {
  const h = getBloomHeight(difficulty)

  if (stage === 'seed') {
    return (
      <g>
        <ellipse cx="0" cy="-2" rx="7" ry="3.5" fill="#8B7E6A" opacity="0.5" />
        <circle cx="0" cy="-4" r="2" fill="#97C459" opacity="0.55" />
      </g>
    )
  }

  if (stage === 'sprout') {
    const stemH = 25 * progress
    return (
      <g>
        <ellipse cx="0" cy="-2" rx="7" ry="3.5" fill="#8B7E6A" opacity="0.4" />
        <motion.line
          x1="0" y1="0" x2="0" y2={-stemH}
          stroke="#7A9B4A" strokeWidth="2" strokeLinecap="round"
          initial={{ y2: 0 }} animate={{ y2: -stemH }} transition={spring}
        />
        <motion.ellipse
          cx="-5" cy={-stemH * 0.5} rx="5" ry="6"
          fill="#97C459" opacity="0.5"
          transform={`rotate(-15 -5 ${-stemH * 0.5})`}
          initial={{ scale: 0 }} animate={{ scale: progress }} transition={spring}
        />
        <motion.ellipse
          cx="5" cy={-stemH * 0.7} rx="4.5" ry="5.5"
          fill="#A8D46A" opacity="0.45"
          transform={`rotate(15 5 ${-stemH * 0.7})`}
          initial={{ scale: 0 }} animate={{ scale: progress }} transition={{ ...spring, delay: 0.1 }}
        />
      </g>
    )
  }

  // bloom - bushy herb with small rounded leaves
  const stemH = h * progress
  const branchCount = difficulty === 'hard' ? 4 : difficulty === 'medium' ? 3 : 2

  const branches = Array.from({ length: branchCount }, (_, i) => {
    const side = i % 2 === 0 ? -1 : 1
    const yBase = -stemH * (0.4 + i * 0.15)
    return (
      <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: progress }} transition={{ ...spring, delay: i * 0.08 }}>
        <line
          x1="0" y1={yBase} x2={side * 12} y2={yBase - 8}
          stroke="#7A9B4A" strokeWidth="1.5" strokeLinecap="round"
        />
        <ellipse cx={side * 10} cy={yBase - 6} rx="5" ry="6" fill="#97C459" opacity="0.5" />
        <ellipse cx={side * 14} cy={yBase - 10} rx="4.5" ry="5.5" fill="#A8D46A" opacity="0.45" />
      </motion.g>
    )
  })

  return (
    <g>
      <ellipse cx="0" cy="-2" rx="7" ry="3.5" fill="#8B7E6A" opacity="0.35" />
      <motion.line
        x1="0" y1="0" x2="0" y2={-stemH}
        stroke="#7A9B4A" strokeWidth="2.5" strokeLinecap="round"
        initial={{ y2: 0 }} animate={{ y2: -stemH }} transition={spring}
      />
      {branches}
      {/* Top leaves cluster */}
      <motion.g
        initial={{ scale: 0 }} animate={{ scale: progress > 0.6 ? 1 : 0 }}
        transition={{ ...spring, delay: 0.2 }}
      >
        <ellipse cx="-3" cy={-stemH - 3} rx="5" ry="6" fill="#97C459" opacity="0.55" />
        <ellipse cx="4" cy={-stemH - 5} rx="4.5" ry="5.5" fill="#A8D46A" opacity="0.5" />
        <ellipse cx="0" cy={-stemH - 8} rx="4" ry="5" fill="#B5E07A" opacity="0.45" />
      </motion.g>
    </g>
  )
}
