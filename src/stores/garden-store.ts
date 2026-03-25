import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { Plant } from '../types'

export interface GardenLevel {
  name: string
  minBlooms: number
  background: string
}

export const GARDEN_LEVELS: GardenLevel[] = [
  { name: '窗台花園', minBlooms: 0, background: 'windowsill' },
  { name: '陽台花園', minBlooms: 11, background: 'balcony' },
  { name: '後院花園', minBlooms: 31, background: 'backyard' },
  { name: '私人花園', minBlooms: 61, background: 'garden' },
  { name: '莊園花園', minBlooms: 101, background: 'estate' },
  { name: '植物園', minBlooms: 151, background: 'botanical' },
]

export function getGardenLevel(totalBlooms: number): GardenLevel {
  for (let i = GARDEN_LEVELS.length - 1; i >= 0; i--) {
    if (totalBlooms >= GARDEN_LEVELS[i].minBlooms) return GARDEN_LEVELS[i]
  }
  return GARDEN_LEVELS[0]
}

interface GardenStore {
  plants: Plant[]
  loading: boolean
  justBloomed: string | null // task ID that just bloomed, for celebration

  fetchPlants: () => Promise<void>
  addPlant: (taskId: string, plantType: string, difficulty: string) => Promise<void>
  setJustBloomed: (taskId: string | null) => void
}

function randomPosition(existing: Plant[]): { x: number; y: number } {
  // Place in a grid-ish pattern with jitter to avoid overlap
  for (let attempt = 0; attempt < 50; attempt++) {
    const x = 10 + Math.random() * 80 // 10%-90% of width
    const y = 40 + Math.random() * 50 // 40%-90% of height (ground area)

    const tooClose = existing.some((p) => {
      const dx = p.position_x - x
      const dy = p.position_y - y
      return Math.sqrt(dx * dx + dy * dy) < 8
    })

    if (!tooClose) return { x, y }
  }
  // Fallback
  return { x: 10 + Math.random() * 80, y: 40 + Math.random() * 50 }
}

export const useGardenStore = create<GardenStore>((set, get) => ({
  plants: [],
  loading: false,
  justBloomed: null,

  fetchPlants: async () => {
    set({ loading: true })
    const { data } = await supabase
      .from('plants')
      .select('*')
      .order('bloomed_at', { ascending: true })

    if (data) {
      set({ plants: data as Plant[], loading: false })
    } else {
      set({ loading: false })
    }
  },

  addPlant: async (taskId, plantType, difficulty) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const pos = randomPosition(get().plants)

    const { error } = await supabase.from('plants').insert({
      user_id: user.id,
      task_id: taskId,
      plant_type: plantType,
      difficulty,
      position_x: pos.x,
      position_y: pos.y,
    })

    if (!error) {
      set({ justBloomed: taskId })
      await get().fetchPlants()
    }
  },

  setJustBloomed: (taskId) => set({ justBloomed: taskId }),
}))
