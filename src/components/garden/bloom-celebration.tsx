import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface BloomCelebrationProps {
  active: boolean
  onComplete: () => void
}

interface Particle {
  id: number
  x: number
  y: number
  color: string
  size: number
  angle: number
  distance: number
}

const COLORS = ['#FAC775', '#E8A0B4', '#AFA9EC', '#97C459', '#85B7EB', '#F4C0D1']

export default function BloomCelebration({ active, onComplete }: BloomCelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (!active) return

    const newParticles: Particle[] = Array.from({ length: 16 }, (_, i) => ({
      id: i,
      x: 50,
      y: 50,
      color: COLORS[i % COLORS.length],
      size: 3 + Math.random() * 4,
      angle: (i / 16) * 360 + Math.random() * 20,
      distance: 60 + Math.random() * 80,
    }))
    setParticles(newParticles)

    const timer = setTimeout(() => {
      setParticles([])
      onComplete()
    }, 2000)

    return () => clearTimeout(timer)
  }, [active, onComplete])

  return (
    <AnimatePresence>
      {active && (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          {/* Center flash */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(250,199,117,0.4) 0%, transparent 70%)' }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 2, 3], opacity: [0, 0.8, 0] }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />

          {/* Sparkle particles */}
          {particles.map((p) => {
            const rad = (p.angle * Math.PI) / 180
            const endX = p.x + p.distance * Math.cos(rad)
            const endY = p.y + p.distance * Math.sin(rad)
            return (
              <motion.div
                key={p.id}
                className="absolute rounded-full"
                style={{
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                }}
                initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1.5, 0.5],
                  opacity: [1, 0.9, 0],
                  left: `${endX}%`,
                  top: `${endY}%`,
                }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            )
          })}

          {/* Text */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.15, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 2, ease: 'easeOut' }}
          >
            <p className="text-2xl font-serif text-garden font-semibold drop-shadow-sm">
              綻放了！
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
