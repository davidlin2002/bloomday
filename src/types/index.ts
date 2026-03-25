export type Category = 'work' | 'study' | 'health' | 'personal' | 'creative'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type TaskStatus = 'planted' | 'growing' | 'bloomed'

export interface Task {
  id: string
  user_id: string
  title: string
  notes: string | null
  category: Category
  difficulty: Difficulty
  status: TaskStatus
  due_date: string | null
  pomodoro_target: number
  pomodoro_completed: number
  created_at: string
  completed_at: string | null
}

export interface PomodoroSession {
  id: string
  task_id: string
  user_id: string
  duration_minutes: number
  started_at: string
  completed: boolean
}

export interface JournalEntry {
  id: string
  user_id: string
  content: string
  learning: string | null
  mood: number
  entry_date: string
  created_at: string
}

export interface Plant {
  id: string
  user_id: string
  task_id: string
  plant_type: string
  difficulty: Difficulty
  position_x: number
  position_y: number
  bloomed_at: string
}

export const CATEGORY_CONFIG: Record<Category, { label: string; emoji: string; plant: string; color: string }> = {
  work: { label: '工作', emoji: '🌻', plant: '向日葵', color: 'sunflower' },
  study: { label: '學習', emoji: '🌿', plant: '蕨類', color: 'garden' },
  health: { label: '健康', emoji: '🌱', plant: '香草', color: 'herb' },
  personal: { label: '個人', emoji: '🌹', plant: '玫瑰', color: 'bloom' },
  creative: { label: '創意', emoji: '💜', plant: '薰衣草', color: 'lavender' },
}

export const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; target: number }> = {
  easy: { label: '簡單', target: 1 },
  medium: { label: '中等', target: 3 },
  hard: { label: '困難', target: 5 },
}

export const MOOD_CONFIG = [
  { value: 1, emoji: '⛈️', label: '暴風雨' },
  { value: 2, emoji: '🌧️', label: '下雨' },
  { value: 3, emoji: '☁️', label: '多雲' },
  { value: 4, emoji: '☀️', label: '晴天' },
  { value: 5, emoji: '🌈', label: '彩虹' },
] as const
