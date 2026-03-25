import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { Task, Category, Difficulty } from '../types'
import { DIFFICULTY_CONFIG } from '../types'
import { useGardenStore } from './garden-store'

interface CreateTaskInput {
  title: string
  notes?: string
  category: Category
  difficulty: Difficulty
  due_date?: string | null
}

interface TaskStore {
  tasks: Task[]
  loading: boolean
  error: string | null

  fetchTasks: () => Promise<void>
  createTask: (input: CreateTaskInput) => Promise<void>
  completeTask: (taskId: string) => Promise<void>
  deleteTask: (taskId: string) => Promise<void>
  incrementPomodoro: (taskId: string) => Promise<void>
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null })
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      set({ error: error.message, loading: false })
    } else {
      set({ tasks: data as Task[], loading: false })
    }
  },

  createTask: async (input) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('tasks').insert({
      user_id: user.id,
      title: input.title,
      notes: input.notes || null,
      category: input.category,
      difficulty: input.difficulty,
      due_date: input.due_date || null,
      pomodoro_target: DIFFICULTY_CONFIG[input.difficulty].target,
    })

    if (error) {
      set({ error: error.message })
    } else {
      await get().fetchTasks()
    }
  },

  completeTask: async (taskId) => {
    const task = get().tasks.find((t) => t.id === taskId)
    const { error } = await supabase
      .from('tasks')
      .update({ status: 'bloomed', completed_at: new Date().toISOString() })
      .eq('id', taskId)

    if (error) {
      set({ error: error.message })
    } else {
      await get().fetchTasks()
      // Add plant to garden
      if (task) {
        await useGardenStore.getState().addPlant(
          taskId,
          task.category,
          task.difficulty,
        )
      }
    }
  },

  deleteTask: async (taskId) => {
    // Delete associated plants first to avoid foreign key constraint
    await supabase.from('plants').delete().eq('task_id', taskId)
    await supabase.from('pomodoro_sessions').delete().eq('task_id', taskId)

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (error) {
      set({ error: error.message })
    } else {
      await useGardenStore.getState().fetchPlants()
      await get().fetchTasks()
    }
  },

  incrementPomodoro: async (taskId) => {
    const task = get().tasks.find((t) => t.id === taskId)
    if (!task) return

    const newCount = task.pomodoro_completed + 1
    const newStatus = newCount >= task.pomodoro_target ? 'bloomed' : 'growing'

    const updates: Partial<Task> = {
      pomodoro_completed: newCount,
      status: newStatus,
    }
    if (newStatus === 'bloomed') {
      updates.completed_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)

    if (error) {
      set({ error: error.message })
    } else {
      await get().fetchTasks()
      // Auto-bloom: add plant to garden
      if (newStatus === 'bloomed') {
        await useGardenStore.getState().addPlant(
          taskId,
          task.category,
          task.difficulty,
        )
      }
    }
  },
}))
