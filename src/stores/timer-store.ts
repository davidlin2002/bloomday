import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { useTaskStore } from './task-store'

type TimerPhase = 'idle' | 'focus' | 'break'

export const FOCUS_PRESETS = [15, 25, 30, 45, 50, 60] as const
export const BREAK_PRESETS = [5, 10, 15] as const

interface TimerStore {
  activeTaskId: string | null
  phase: TimerPhase
  secondsRemaining: number
  totalSeconds: number
  intervalId: number | null
  focusMinutes: number
  breakMinutes: number

  setFocusMinutes: (m: number) => void
  setBreakMinutes: (m: number) => void
  startTimer: (taskId: string) => void
  pauseTimer: () => void
  resumeTimer: () => void
  resetTimer: () => void
  tick: () => void
  completeFocusSession: () => Promise<void>
  startBreak: () => void
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  activeTaskId: null,
  phase: 'idle',
  secondsRemaining: 25 * 60,
  totalSeconds: 25 * 60,
  intervalId: null,
  focusMinutes: 25,
  breakMinutes: 5,

  setFocusMinutes: (m) => {
    if (get().phase !== 'idle') return
    set({ focusMinutes: m, secondsRemaining: m * 60, totalSeconds: m * 60 })
  },

  setBreakMinutes: (m) => {
    if (get().phase !== 'idle') return
    set({ breakMinutes: m })
  },

  startTimer: (taskId: string) => {
    const { intervalId, focusMinutes } = get()
    if (intervalId) clearInterval(intervalId)

    const total = focusMinutes * 60
    const id = window.setInterval(() => get().tick(), 1000)

    set({
      activeTaskId: taskId,
      phase: 'focus',
      secondsRemaining: total,
      totalSeconds: total,
      intervalId: id,
    })
  },

  pauseTimer: () => {
    const { intervalId } = get()
    if (intervalId) {
      clearInterval(intervalId)
      set({ intervalId: null })
    }
  },

  resumeTimer: () => {
    const { phase, intervalId } = get()
    if (phase !== 'idle' && !intervalId) {
      const id = window.setInterval(() => get().tick(), 1000)
      set({ intervalId: id })
    }
  },

  resetTimer: () => {
    const { intervalId, focusMinutes } = get()
    if (intervalId) clearInterval(intervalId)

    set({
      activeTaskId: null,
      phase: 'idle',
      secondsRemaining: focusMinutes * 60,
      totalSeconds: focusMinutes * 60,
      intervalId: null,
    })
  },

  tick: () => {
    const { secondsRemaining, phase } = get()

    if (secondsRemaining <= 1) {
      const { intervalId } = get()
      if (intervalId) clearInterval(intervalId)
      set({ secondsRemaining: 0, intervalId: null })

      if (phase === 'focus') {
        get().completeFocusSession()
      } else if (phase === 'break') {
        get().resetTimer()
      }
      return
    }

    set({ secondsRemaining: secondsRemaining - 1 })
  },

  completeFocusSession: async () => {
    const { activeTaskId, focusMinutes } = get()
    if (!activeTaskId) return

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('pomodoro_sessions').insert({
        task_id: activeTaskId,
        user_id: user.id,
        duration_minutes: focusMinutes,
        completed: true,
      })
    }

    await useTaskStore.getState().incrementPomodoro(activeTaskId)
    get().startBreak()
  },

  startBreak: () => {
    const { breakMinutes } = get()
    const total = breakMinutes * 60
    const id = window.setInterval(() => get().tick(), 1000)

    set({
      phase: 'break',
      secondsRemaining: total,
      totalSeconds: total,
      intervalId: id,
    })
  },
}))
