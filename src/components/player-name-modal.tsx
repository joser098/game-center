import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { User, Trophy, Delete } from "lucide-react"

interface PlayerNameModalProps {
  isOpen: boolean
  onSubmit: (name: string) => void
  gameTitle: string
}

const KEYS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L","Ñ"],
  ["Z","X","C","V","B","N","M"]
]

export default function PlayerNameModal({ isOpen, onSubmit, gameTitle }: PlayerNameModalProps) {
  const [playerName, setPlayerName] = useState("")

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (playerName.trim()) {
      onSubmit(playerName.trim())
    }
  }

  const handleKeyPress = (key: string) => {
    if (playerName.length < 20) setPlayerName((prev) => prev + key)
  }

  const handleDelete = () => {
    setPlayerName((prev) => prev.slice(0, -1))
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 w-full max-w-[1800px] mx-4">
        <CardHeader>
          <CardTitle className="text-7xl text-white text-center flex items-center justify-center">
            <Trophy className="w-12 h-12 mr-3 text-yellow-500" />
            ¡Registra tu Puntuación!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center">
              <p className="text-6xl text-white/90 mb-5">Juego: {gameTitle}</p>
              <p className="text-5xl text-white/70 my-10">Ingresa tu nombre para aparecer en el leaderboard</p>
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
                  className="pl-12 text-6xl h-32 text-center bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  autoFocus
                />
              </div>

              {/* Virtual Keyboard */}
              <div className="space-y-4 my-12">
                {KEYS.map((row, i) => (
                  <div key={i} className="flex justify-center gap-4">
                    {row.map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleKeyPress(key)}
                        className="text-8xl bg-white/20 hover:bg-white/60 text-white rounded-xl h-40 px-8 py-3"
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                ))}
                <div className="flex justify-center gap-2 my-12">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="text-5xl bg-red-500/70 hover:bg-red-500 text-white rounded-xl px-6 py-6 flex items-center gap-4"
                  >
                    <Delete className="w-12 h-12" /> Borrar
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={!playerName.trim()}
                className={`w-full text-6xl h-32 py-6 bg-white/20 hover:bg-white/60 disabled:opacity-50`}
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
