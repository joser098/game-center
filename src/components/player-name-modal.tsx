import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { User, Trophy } from "lucide-react"

interface PlayerNameModalProps {
  isOpen: boolean
  onSubmit: (name: string) => void
  gameTitle: string
}

export default function PlayerNameModal({ isOpen, onSubmit, gameTitle }: PlayerNameModalProps) {
  const [playerName, setPlayerName] = useState("")

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (playerName.trim()) {
      onSubmit(playerName.trim())
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 w-full max-w-6xl mx-4">
        <CardHeader>
          <CardTitle className="text-6xl text-white text-center flex items-center justify-center">
            <Trophy className="w-12 h-12 mr-3 text-yellow-500" />
            ¡Registra tu Puntuación!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center">
              <p className="text-5xl text-white/90 mb-2">Juego: {gameTitle}</p>
              <p className="text-2xl text-white/70">Ingresa tu nombre para aparecer en el leaderboard</p>
            </div>

            <div className="space-y-8">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-12 h-12 text-white/50" />
                <Input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Tu nombre..."
                  maxLength={20}
                  className="pl-12 text-4xl h-20 text-center bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                disabled={!playerName.trim()}
                className={`w-full text-4xl h-16 py-6 bg-white/20 hover:bg-white/60 disabled:opacity-50`}
              >
                <Trophy className="w-12 h-12 mr-2" />
                Guardar Puntuación
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
