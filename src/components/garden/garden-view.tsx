import { useEffect, useCallback, useMemo, useState } from 'react'
import { useGardenStore, getGardenLevel } from '../../stores/garden-store'
import { useTaskStore } from '../../stores/task-store'
import { useTimerStore } from '../../stores/timer-store'
import { useJournalStore } from '../../stores/journal-store'
import type { Category } from '../../types'
import Plant from './plant'
import WeatherOverlay from './weather-overlay'
import BloomCelebration from './bloom-celebration'

import windowsillBg from '../../assets/backgrounds/windowsill.webp'
import balconyBg from '../../assets/backgrounds/balcony.webp'
import backyardBg from '../../assets/backgrounds/backyard.webp'
import gardenBg from '../../assets/backgrounds/garden.webp'
import estateBg from '../../assets/backgrounds/estate.webp'
import botanicalBg from '../../assets/backgrounds/botanical.webp'

const BG_MAP: Record<string, string> = {
  windowsill: windowsillBg,
  balcony: balconyBg,
  backyard: backyardBg,
  garden: gardenBg,
  estate: estateBg,
  botanical: botanicalBg,
}

export default function GardenView() {
  const { plants, loading, justBloomed, fetchPlants, setJustBloomed } = useGardenStore()
  const tasks = useTaskStore((s) => s.tasks)
  const { activeTaskId, phase, secondsRemaining, totalSeconds } = useTimerStore()
  const todayEntry = useJournalStore((s) => s.todayEntry)

  useEffect(() => {
    fetchPlants()
  }, [fetchPlants])

  const totalBlooms = plants.length
  const level = getGardenLevel(totalBlooms)
  const bgUrl = BG_MAP[level.background]
  const mood = todayEntry?.mood ?? 3

  // Calculate growing plant progress during pomodoro
  const pomodoroProgress = phase === 'focus' && totalSeconds > 0
    ? (totalSeconds - secondsRemaining) / totalSeconds
    : 0

  // Find the active task for growing animation
  const activeTask = activeTaskId ? tasks.find((t) => t.id === activeTaskId) : null

  const handleCelebrationDone = useCallback(() => {
    setJustBloomed(null)
  }, [setJustBloomed])

  // Next level info
  const nextLevel = useMemo(() => {
    return [
      { minBlooms: 11, name: '陽台花園' },
      { minBlooms: 31, name: '後院花園' },
      { minBlooms: 61, name: '私人花園' },
      { minBlooms: 101, name: '莊園花園' },
      { minBlooms: 151, name: '植物園' },
    ].find((l) => l.minBlooms > totalBlooms)
  }, [totalBlooms])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ backgroundImage: `url(${bgUrl})` }}
      />
      {/* Soft cream overlay for readability */}
      <div className="absolute inset-0 bg-cream/20" />

      {/* Weather overlay */}
      <WeatherOverlay mood={mood} />

      {/* Plants SVG layer */}
      <svg className="absolute inset-0 w-full h-full overflow-hidden" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMax meet">
        {/* Bloomed plants */}
        {plants.map((plant) => (
          <g
            key={plant.id}
            transform={`translate(${plant.position_x * 10}, ${plant.position_y * 6})`}
          >
            <Plant
              category={plant.plant_type as Category}
              stage="bloom"
              difficulty={plant.difficulty}
              progress={1}
            />
          </g>
        ))}

        {/* Growing plant during pomodoro */}
        {activeTask && phase === 'focus' && (
          <g transform="translate(500, 480)">
            <Plant
              category={activeTask.category}
              stage={pomodoroProgress < 0.3 ? 'seed' : pomodoroProgress < 0.7 ? 'sprout' : 'bloom'}
              difficulty={activeTask.difficulty}
              progress={pomodoroProgress}
            />
          </g>
        )}
      </svg>

      {/* Center clock */}
      <GardenClock />

      {/* Bloom celebration */}
      <BloomCelebration active={!!justBloomed} onComplete={handleCelebrationDone} />

      {/* Level info overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/40">
          <p className="text-sm font-serif text-brown font-medium">
            {level.name}
          </p>
          <p className="text-[10px] text-brown-light">
            {totalBlooms} 朵花已綻放
            {nextLevel && ` · 再 ${nextLevel.minBlooms - totalBlooms} 朵升級`}
          </p>
        </div>
      </div>

      {/* Empty state */}
      {!loading && plants.length === 0 && phase !== 'focus' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center bg-white/40 backdrop-blur-sm rounded-2xl px-8 py-6">
            <div className="text-5xl mb-3 opacity-40">🌱</div>
            <p className="text-brown-light text-sm">
              你的花園正在等待第一朵花
            </p>
            <p className="text-brown-light/60 text-xs mt-1">
              完成任務讓種子綻放吧
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function GardenClock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const time = now.toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const date = now.toLocaleDateString('zh-TW', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  })

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center pointer-events-none">
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/40 shadow-sm">
        <p className="text-3xl font-serif font-light text-brown tabular-nums tracking-wide">
          {time}
        </p>
        <p className="text-[11px] text-brown-light mt-0.5">
          {date}
        </p>
      </div>
    </div>
  )
}
