import { map } from "nanostores"

export interface GameConfig {
  [gameId: string]: boolean
}

export interface UserSettings {
  games: GameConfig
  expiresAt?: string
  durationDays?: number
  durationHours?: number
  showBanner?: boolean
  appConfigured?: boolean
}

// 🧱 Store en memoria (no se guarda en localStorage)
export const userSettings = map<UserSettings>({
  games: {},
  expiresAt: undefined,
  durationDays: 1,
  durationHours: 0,
  showBanner: false,
  appConfigured: false,
})
