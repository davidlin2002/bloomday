import { motion } from 'framer-motion'
import type { PlantProps } from './plant-types'
import { getBloomHeight } from './plant-types'

const spring = { type: 'spring' as const, damping: 12, stiffness: 100 }

export default function Sunflower({ stage, difficulty, progress = 1 }: PlantProps) {
  const h = getBloomHeight(difficulty)

  if (stage === 'seed') {
    return (
      <g>
        <ellipse cx="0" cy="-2" rx="8" ry="4" fill="#8B7E6A" opacity="0.5" />
        <circle cx="0" cy="-5" r="2.5" fill="#7A9B4A" opacity="0.6" />
      </g>
    )
  }

  if (stage === 'sprout') {
    const stemH = 30 * progress
    return (
      <g>
        <ellipse cx="0" cy="-2" rx="8" ry="4" fill="#8B7E6A" opacity="0.4" />
        <motion.line
          x1="0" y1="0" x2="0" y2={-stemH}
          stroke="#7A9B4A" strokeWidth="2.5" strokeLinecap="round"
          initial={{ y2: 0 }} animate={{ y2: -stemH }} transition={spring}
        />
        <motion.ellipse
          cx="-7" cy={-stemH * 0.5} rx="6" ry="10"
          fill="#8FB85A" opacity="0.5"
          transform={`rotate(-25 -7 ${-stemH * 0.5})`}
          initial={{ scale: 0 }} animate={{ scale: progress }} transition={spring}
        />
        <motion.ellipse
          cx="6" cy={-stemH * 0.7} rx="5" ry="8"
          fill="#A3C76E" opacity="0.45"
          transform={`rotate(20 6 ${-stemH * 0.7})`}
          initial={{ scale: 0 }} animate={{ scale: progress }} transition={{ ...spring, delay: 0.1 }}
        />
      </g>
    )
  }

  // bloom
  const stemH = h * progress
  return (
    <g>
      <ellipse cx="0" cy="-2" rx="8" ry="4" fill="#8B7E6A" opacity="0.35" />
      <motion.line
        x1="0" y1="0" x2="0" y2={-stemH}
        stroke="#7A9B4A" strokeWidth="3" strokeLinecap="round"
        initial={{ y2: 0 }} animate={{ y2: -stemH }} transition={spring}
      />
      {/* Leaves */}
      <motion.ellipse
        cx="-10" cy={-stemH * 0.3} rx="10" ry="14"
        fill="#8FB85A" opacity="0.55"
        transform={`rotate(-20 -10 ${-stemH * 0.3})`}
        initial={{ scale: 0 }} animate={{ scale: progress }} transition={spring}
      />
      <motion.ellipse
        cx="10" cy={-stemH * 0.5} rx="9" ry="12"
        fill="#A3C76E" opacity="0.5"
        transform={`rotate(25 10 ${-stemH * 0.5})`}
        initial={{ scale: 0 }} animate={{ scale: progress }} transition={{ ...spring, delay: 0.1 }}
      />
      {difficulty !== 'easy' && (
        <motion.ellipse
          cx="-8" cy={-stemH * 0.65} rx="7" ry="10"
          fill="#97C459" opacity="0.45"
          transform={`rotate(-15 -8 ${-stemH * 0.65})`}
          initial={{ scale: 0 }} animate={{ scale: progress }} transition={{ ...spring, delay: 0.15 }}
        />
      )}
      {/* Flower */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: progress > 0.7 ? 1 : 0, opacity: progress > 0.7 ? 1 : 0 }}
        transition={{ ...spring, delay: 0.2 }}
      >
        <circle cx="0" cy={-stemH - 2} r={difficulty === 'hard' ? 14 : difficulty === 'medium' ? 12 : 10} fill="#FAC775" opacity="0.6" />
        <circle cx="-6" cy={-stemH + 3} r={difficulty === 'hard' ? 10 : 7} fill="#FADA8E" opacity="0.5" />
        <circle cx="6" cy={-stemH + 3} r={difficulty === 'hard' ? 10 : 7} fill="#FAC775" opacity="0.5" />
        <circle cx="0" cy={-stemH - 10} r={difficulty === 'hard' ? 9 : 6} fill="#FDE4AA" opacity="0.45" />
        {difficulty === 'hard' && (
          <>
            <circle cx="-10" cy={-stemH - 6} r="7" fill="#FAC775" opacity="0.4" />
            <circle cx="10" cy={-stemH - 6} r="7" fill="#FADA8E" opacity="0.4" />
          </>
        )}
        <circle cx="0" cy={-stemH} r={difficulty === 'hard' ? 5 : 4} fill="#8B7E6A" opacity="0.6" />
      </motion.g>
    </g>
  )
}
