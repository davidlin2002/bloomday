import { useEffect } from 'react'
import { useTaskStore } from '../stores/task-store'
import { useTimerStore } from '../stores/timer-store'

export function useDocumentTitle() {
  const tasks = useTaskStore((s) => s.tasks)
  const { phase, secondsRemaining } = useTimerStore()

  useEffect(() => {
    // During pomodoro, show timer in title
    if (phase === 'focus' || phase === 'break') {
      const min = Math.floor(secondsRemaining / 60)
      const sec = secondsRemaining % 60
      const time = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
      const label = phase === 'focus' ? '💧 專注' : '☀️ 休息'
      document.title = `${time} ${label} — Bloomday`
      return
    }

    // Check for overdue/needing-water seeds
    const today = new Date().toISOString().split('T')[0]
    const needsWater = tasks.filter(
      (t) => t.status !== 'bloomed' && (!t.due_date || t.due_date <= today),
    ).length

    if (needsWater > 0) {
      document.title = `🌱 ${needsWater} 顆種子需要澆水！— Bloomday`
    } else {
      document.title = 'Bloomday'
    }
  }, [tasks, phase, secondsRemaining])
}
