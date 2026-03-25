import { motion } from 'framer-motion'
import type { PlantProps } from './plant-types'
import { getBloomHeight } from './plant-types'

const spring = { type: 'spring' as const, damping: 12, stiffness: 100 }

export default function Lavender({ stage, difficulty, progress = 1 }: PlantProps) {
  const h = getBloomHeight(difficulty)

  if (stage === 'seed') {
    return (
      <g>
        <ellipse cx="0" cy="-2" rx="7" ry="3.5" fill="#8B7E6A" opacity="0.5" />
        <circle cx="0" cy="-5" r="2" fill="#AFA9EC" opacity="0.5" />
      </g>
    )
  }

  if (stage === 'sprout') {
    const stemH = 28 * progress
    return (
      <g>
        <ellipse cx="0" cy="-2" rx="7" ry="3.5" fill="#8B7E6A" opacity="0.4" />
        <motion.line
          x1="0" y1="0" x2="0" y2={-stemH}
          stroke="#7A9B4A" strokeWidth="2" strokeLinecap="round"
          initial={{ y2: 0 }} animate={{ y2: -stemH }} transition={spring}
        />
        <motion.ellipse
          cx="-4" cy={-stemH * 0.5} rx="3" ry="9"
          fill="#8FB85A" opacity="0.5"
          transform={`rotate(-10 -4 ${-stemH * 0.5})`}
          initial={{ scale: 0 }} animate={{ scale: progress }} transition={spring}
        />
        <motion.ellipse
          cx="4" cy={-stemH * 0.65} rx="3" ry="8"
          fill="#A3C76E" opacity="0.45"
          transform={`rotate(10 4 ${-stemH * 0.65})`}
          initial={{ scale: 0 }} animate={{ scale: progress }} transition={{ ...spring, delay: 0.1 }}
        />
      </g>
    )
  }

  // bloom - tall spikes with purple clusters
  const stemH = h * progress
  const spikeCount = difficulty === 'hard' ? 4 : difficulty === 'medium' ? 3 : 2

  const spikes = Array.from({ length: spikeCount }, (_, i) => {
    const offsetX = (i - (spikeCount - 1) / 2) * 8
    const spikeH = stemH * (0.85 + i * 0.05)
    return (
      <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: progress }} transition={{ ...spring, delay: i * 0.1 }}>
        <line
          x1={offsetX} y1={-stemH * 0.3} x2={offsetX} y2={-spikeH}
          stroke="#7A9B4A" strokeWidth="1.5" strokeLinecap="round"
        />
        {/* Narrow leaves */}
        <ellipse
          cx={offsetX - 3} cy={-spikeH * 0.4} rx="2" ry="7"
          fill="#8FB85A" opacity="0.45"
          transform={`rotate(-8 ${offsetX - 3} ${-spikeH * 0.4})`}
        />
        <ellipse
          cx={offsetX + 3} cy={-spikeH * 0.55} rx="2" ry="6"
          fill="#A3C76E" opacity="0.4"
          transform={`rotate(8 ${offsetX + 3} ${-spikeH * 0.55})`}
        />
      </motion.g>
    )
  })

  // Purple flower clusters at tips
  const flowers = Array.from({ length: spikeCount }, (_, i) => {
    const offsetX = (i - (spikeCount - 1) / 2) * 8
    const spikeH = stemH * (0.85 + i * 0.05)
    const colors = ['#AFA9EC', '#B8B3F0', '#C5C0F5']
    return (
      <motion.g
        key={i}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: progress > 0.7 ? 1 : 0, opacity: progress > 0.7 ? 1 : 0 }}
        transition={{ ...spring, delay: 0.2 + i * 0.08 }}
      >
        {[0, -5, -10, -15].map((dy, j) => (
          <circle
            key={j}
            cx={offsetX} cy={-spikeH + dy}
            r={3.5 - j * 0.3}
            fill={colors[j % 3]}
            opacity={0.55 - j * 0.05}
          />
        ))}
      </motion.g>
    )
  })

  return (
    <g>
      <ellipse cx="0" cy="-2" rx="7" ry="3.5" fill="#8B7E6A" opacity="0.35" />
      <motion.line
        x1="0" y1="0" x2="0" y2={-stemH * 0.3}
        stroke="#7A9B4A" strokeWidth="2.5" strokeLinecap="round"
        initial={{ y2: 0 }} animate={{ y2: -stemH * 0.3 }} transition={spring}
      />
      {spikes}
      {flowers}
    </g>
  )
}
