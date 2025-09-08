export interface PlayerScore {
  id: string
  playerName: string
  game: string
  score: number
  details: string
  timestamp: number
  difficulty?: string
}

export interface LeaderboardEntry {
  playerName: string
  totalScore: number
  gamesPlayed: number
  bestScores: { [game: string]: PlayerScore }
  lastPlayed: number
}

const STORAGE_KEY = "coca_cola_leaderboard"

export const getLeaderboard = (): PlayerScore[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export const saveScore = (score: PlayerScore) => {
  if (typeof window === "undefined") return
  const scores = getLeaderboard()
  scores.push(score)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores))
}

export const getTopPlayers = (limit = 10): LeaderboardEntry[] => {
  const scores = getLeaderboard()
  const playerMap = new Map<string, LeaderboardEntry>()

  scores.forEach((score) => {
    const existing = playerMap.get(score.playerName)
    if (existing) {
      existing.totalScore += score.score
      existing.gamesPlayed += 1
      existing.lastPlayed = Math.max(existing.lastPlayed, score.timestamp)

      // Update best score for this game if better
      const currentBest = existing.bestScores[score.game]
      if (!currentBest || score.score > currentBest.score) {
        existing.bestScores[score.game] = score
      }
    } else {
      playerMap.set(score.playerName, {
        playerName: score.playerName,
        totalScore: score.score,
        gamesPlayed: 1,
        bestScores: { [score.game]: score },
        lastPlayed: score.timestamp,
      })
    }
  })

  return Array.from(playerMap.values())
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, limit)
}

export const getGameLeaderboard = (game: string, limit = 10): PlayerScore[] => {
  const scores = getLeaderboard()
  return scores
    .filter((score) => score.game === game)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

export const clearLeaderboard = () => {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}

export const generatePlayerId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
