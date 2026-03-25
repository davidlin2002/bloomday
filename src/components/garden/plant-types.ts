import type { Difficulty } from '../../types'

export type GrowthStage = 'seed' | 'sprout' | 'bloom'

export interface PlantProps {
  stage: GrowthStage
  difficulty: Difficulty
  progress?: number // 0-1, for animation during pomodoro
}

export function getBloomHeight(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy': return 60
    case 'medium': return 90
    case 'hard': return 120
  }
}
