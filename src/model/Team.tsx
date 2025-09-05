export interface Player {
  id?: number
  image?: string
  name: string
  team: string
  number: string
  position?: string
  height?: string
  weight?: string
  scores?: number
  ftm?: number
  assists?: number
  rebounds?: number
  steals?: number
  blocks?: number
  turnovers?: number
  fouls?: number
  games?: number
  threePoints?: number
  penaltyShots?: number
  penaltyShotsIn?: number
}

export interface Team {
  id?: number
  name: string
  logo?: string
  win?: number
  loss?: number
  draw?: number
  points?: number
  lastMatch?: 'win' | 'loss' | 'draw' | 'undefined'
  matches?: number
  players: Player[]
}
