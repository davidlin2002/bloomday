import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export interface Letter {
  id: string
  user_id: string
  content: string
  reveal_date: string
  revealed: boolean
  created_at: string
}

interface LetterStore {
  letters: Letter[]
  revealedToday: Letter[]
  loading: boolean

  fetchLetters: () => Promise<void>
  createLetter: (content: string, revealDate: string) => Promise<void>
  markRevealed: (id: string) => Promise<void>
}

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

export const useLetterStore = create<LetterStore>((set, get) => ({
  letters: [],
  revealedToday: [],
  loading: false,

  fetchLetters: async () => {
    set({ loading: true })
    const today = getToday()

    const { data } = await supabase
      .from('letters')
      .select('*')
      .order('reveal_date', { ascending: true })

    if (data) {
      const letters = data as Letter[]
      const revealedToday = letters.filter(
        (l) => l.reveal_date <= today && !l.revealed,
      )
      set({ letters, revealedToday, loading: false })
    } else {
      set({ loading: false })
    }
  },

  createLetter: async (content, revealDate) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('letters').insert({
      user_id: user.id,
      content,
      reveal_date: revealDate,
    })

    await get().fetchLetters()
  },

  markRevealed: async (id) => {
    await supabase
      .from('letters')
      .update({ revealed: true })
      .eq('id', id)

    await get().fetchLetters()
  },
}))
