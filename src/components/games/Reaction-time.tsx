import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import GameLayout from "@/components/game-layout"
import { Trophy, Play, RotateCcw, Zap, Clock } from "lucide-react"
import brandingData from "@/utils/conts"

export default function ReactionTimeGame() {
  const [gameState, setGameState] = useState<"waiting" | "ready" | "go" | "clicked" | "tooEarly">("waiting")
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [bestTime, setBestTime] = useState<number | null>(null)
  const [attempts, setAttempts] = useState<number[]>([])
  const [countdown, setCountdown] = useState(0)
  const startTimeRef = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const startGame = () => {
    setGameState("ready")
    setReactionTime(null)
    setCountdown(3)

    // Countdown
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          // Random delay between 1-5 seconds
          const delay = Math.random() * 4000 + 1000
          timeoutRef.current = setTimeout(() => {
            setGameState("go")
            startTimeRef.current = Date.now()
          }, delay)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleClick = () => {
    if (gameState === "ready") {
      setGameState("tooEarly")
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    } else if (gameState === "go") {
      const endTime = Date.now()
      const reaction = endTime - startTimeRef.current
      setReactionTime(reaction)
      setGameState("clicked")

      const newAttempts = [...attempts, reaction]
      setAttempts(newAttempts)

      if (!bestTime || reaction < bestTime) {
        setBestTime(reaction)
      }
    }
  }

  const resetGame = () => {
    setGameState("waiting")
    setReactionTime(null)
    setCountdown(0)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const resetAll = () => {
    resetGame()
    setAttempts([])
    setBestTime(null)
  }

  const getReactionRating = (time: number) => {
    if (time < 200) return { text: "¡Increíble! 🚀", color: "text-green-400" }
    if (time < 250) return { text: "¡Excelente! ⚡", color: "text-green-300" }
    if (time < 300) return { text: "¡Muy bueno! 👏", color: "text-blue-400" }
    if (time < 400) return { text: "¡Bueno! 👍", color: "text-yellow-400" }
    if (time < 500) return { text: "Normal 😊", color: "text-orange-400" }
    return { text: "¡Puedes mejorar! 💪", color: "text-red-400" }
  }

  const averageTime = attempts.length > 0 ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length) : 0

  if (gameState === "waiting") {
    return (
      <GameLayout gameTitle="Tiempo de Reacción">
        <div className="max-w-8xl mx-auto text-center">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
            <CardHeader>
              <CardTitle className="text-8xl text-white">⚡ Tiempo de Reacción</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-4xl text-white/90">Pon a prueba la velocidad de tus reflejos</p>
              <div className="text-3xl text-white/80 space-y-2">
                <p>🎯 Espera a que aparezca la señal verde</p>
                <p>⚡ Haz clic lo más rápido posible</p>
                <p>⏱️ Mide tu tiempo de reacción</p>
                <p>🏆 ¡Mejora tu récord personal!</p>
              </div>

              {attempts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="text-6xl font-bold text-green-400">{bestTime}ms</div>
                    <div className="text-white/80">Mejor Tiempo</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="text-6xl font-bold text-blue-400">{averageTime}ms</div>
                    <div className="text-white/80">Promedio</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="text-6xl font-bold text-yellow-400">{attempts.length}</div>
                    <div className="text-white/80">Intentos</div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <Button onClick={startGame} size="lg" className={`text-3xl py-8 px-12 bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.4)]`}>
                  <Play className="w-12 h-12 mr-3" />
                  ¡Comenzar!
                </Button>
                {attempts.length > 0 && (
                  <Button
                    onClick={resetAll}
                    size="lg"
                    variant="outline"
                    className="text-white text-3xl border-white/30 bg-white/10 hover:bg-white/20"
                  >
                    <RotateCcw className="w-6 h-6 mr-2" />
                    Reiniciar Todo
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </GameLayout>
    )
  }

  return (
    <GameLayout gameTitle="Tiempo de Reacción">
      <div className="max-w-8xl mx-auto">
        <div className="text-center mb-8">
          {attempts.length > 0 && (
            <div className="flex justify-center items-center space-x-8 mb-6">
              <div className="text-4xl text-white/90">
                Mejor: <span className="text-green-400 font-bold">{bestTime}ms</span>
              </div>
              <div className="text-4xl text-white/90">
                Promedio: <span className="text-blue-400 font-bold">{averageTime}ms</span>
              </div>
              <div className="text-4xl text-white/90">
                Intentos: <span className="text-yellow-400 font-bold">{attempts.length}</span>
              </div>
            </div>
          )}
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-12">
            <div
              className={`w-full h-[600px] rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 ${
                gameState === "ready" && countdown > 0
                  ? "bg-yellow-500"
                  : gameState === "ready" && countdown === 0
                    ? "bg-yellow-600"
                    : gameState === "go"
                      ? "bg-green-500 animate-pulse"
                      : gameState === "clicked"
                        ? "bg-blue-500"
                        : gameState === "tooEarly"
                          ? "bg-red-500"
                          : "bg-gray-600"
              }`}
              onClick={handleClick}
            >
              <div className="text-center">
                {gameState === "ready" && countdown > 0 && (
                  <div>
                    <div className="text-8xl font-bold text-white mb-4">{countdown}</div>
                    <div className="text-4xl text-white">Prepárate...</div>
                  </div>
                )}

                {gameState === "ready" && countdown === 0 && (
                  <div>
                    <Clock className="w-24 h-24 text-white mx-auto mb-4" />
                    <div className="text-4xl text-white">Espera la señal verde...</div>
                  </div>
                )}

                {gameState === "go" && (
                  <div>
                    <Zap className="w-32 h-32 text-white mx-auto mb-4" />
                    <div className="text-4xl font-bold text-white">¡AHORA!</div>
                  </div>
                )}

                {gameState === "clicked" && reactionTime && (
                  <div>
                    <Trophy className="w-24 h-24 text-white mx-auto mb-4" />
                    <div className="text-8xl font-bold text-white mb-4">{reactionTime}ms</div>
                    <div className={`text-4xl font-bold ${getReactionRating(reactionTime).color}`}>
                      {getReactionRating(reactionTime).text}
                    </div>
                  </div>
                )}

                {gameState === "tooEarly" && (
                  <div>
                    <div className="text-6xl mb-4">😅</div>
                    <div className="text-4xl font-bold text-white mb-2">¡Muy temprano!</div>
                    <div className="text-4xl text-white">Espera la señal verde</div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8 space-x-4">
          {(gameState === "clicked" || gameState === "tooEarly") && (
            <Button onClick={startGame} size="lg" className="text-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.4)]">
              <Play className="w-5 h-5 mr-2" />
              Intentar de Nuevo
            </Button>
          )}
          <Button
            onClick={resetGame}
            variant="outline"
            size="lg"
            className="text-white text-3xl border-white/30 bg-white/10 hover:bg-white/20"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Cancelar
          </Button>
        </div>
      </div>
    </GameLayout>
  )
}
