import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { JournalEntry } from '../types'

interface JournalStore {
  todayEntry: JournalEntry | null
  entries: JournalEntry[]
  loading: boolean
  saving: boolean

  fetchTodayEntry: () => Promise<void>
  fetchEntries: () => Promise<void>
  saveEntry: (content: string, mood: number, learning?: string) => Promise<void>
}

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

export const useJournalStore = create<JournalStore>((set, get) => ({
  todayEntry: null,
  entries: [],
  loading: false,
  saving: false,

  fetchTodayEntry: async () => {
    set({ loading: true })
    const today = getToday()

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('entry_date', today)
      .maybeSingle()

    if (!error) {
      set({ todayEntry: data as JournalEntry | null, loading: false })
    } else {
      set({ loading: false })
    }
  },

  fetchEntries: async () => {
    const { data } = await supabase
      .from('journal_entries')
      .select('*')
      .order('entry_date', { ascending: false })
      .limit(30)

    if (data) {
      set({ entries: data as JournalEntry[] })
    }
  },

  saveEntry: async (content, mood, learning) => {
    set({ saving: true })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { set({ saving: false }); return }

    const today = getToday()
    const existing = get().todayEntry

    if (existing) {
      // Update existing entry
      const { data, error } = await supabase
        .from('journal_entries')
        .update({ content, mood, learning: learning || null })
        .eq('id', existing.id)
        .select()
        .single()

      if (!error && data) {
        set({ todayEntry: data as JournalEntry, saving: false })
      } else {
        set({ saving: false })
      }
    } else {
      // Create new entry
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          content,
          mood,
          learning: learning || null,
          entry_date: today,
        })
        .select()
        .single()

      if (!error && data) {
        set({ todayEntry: data as JournalEntry, saving: false })
      } else {
        set({ saving: false })
      }
    }
  },
}))
