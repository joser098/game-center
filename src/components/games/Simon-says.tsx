import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import GameLayout from "@/components/game-layout"
import PlayerNameModal from "@/components/player-name-modal"
import { Trophy, Play, RotateCcw } from "lucide-react"
import { saveScore, generatePlayerId } from "@/lib/leaderboard"
import brandingData from "@/utils/conts"

const colors = [
  { id: 0, name: "Rojo", color: "#E60012", sound: "Do", freq: 261.6 },   // C4
  { id: 1, name: "Azul", color: "#0066CC", sound: "Re", freq: 329.6 },   // E4
  { id: 2, name: "Verde", color: "#00AA00", sound: "Mi", freq: 392.0 },  // G4
  { id: 3, name: "Amarillo", color: "#FFD700", sound: "Fa", freq: 523.2 } // C5
];

export default function SimonSaysGame() {
  const [sequence, setSequence] = useState<number[]>([])
  const [playerSequence, setPlayerSequence] = useState<number[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPlayerTurn, setIsPlayerTurn] = useState(false)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [activeColor, setActiveColor] = useState<number | null>(null)
  const [showNameModal, setShowNameModal] = useState(false)

  const playSequence = useCallback(async () => {
    setIsPlayerTurn(false)
    for (let i = 0; i < sequence.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 600))
      setActiveColor(sequence[i])
      playTone(colors[sequence[i]].freq)
      await new Promise((resolve) => setTimeout(resolve, 400))
      setActiveColor(null)
    }
    setIsPlayerTurn(true)
  }, [sequence])

  const startGame = () => {
    const newSequence = [Math.floor(Math.random() * 4)]
    setSequence(newSequence)
    setPlayerSequence([])
    setScore(0)
    setGameOver(false)
    setIsPlaying(true)
    setShowNameModal(false)
  }

  const resetGame = () => {
    setSequence([])
    setPlayerSequence([])
    setScore(0)
    setGameOver(false)
    setIsPlaying(false)
    setIsPlayerTurn(false)
    setActiveColor(null)
    setShowNameModal(false)
  }

  const handleColorClick = (colorId: number) => {
    if (!isPlayerTurn || gameOver) return

    const newPlayerSequence = [...playerSequence, colorId]
    setPlayerSequence(newPlayerSequence)
    playTone(colors[colorId].freq);

    // Check if the player's move is correct
    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      setGameOver(true)
      setIsPlayerTurn(false)
      setShowNameModal(true)
      return
    }

    // Check if player completed the sequence
    if (newPlayerSequence.length === sequence.length) {
      setScore(score + 1)
      setPlayerSequence([])

      // Add new color to sequence
      setTimeout(() => {
        const newSequence = [...sequence, Math.floor(Math.random() * 4)]
        setSequence(newSequence)
      }, 1000)
    }
  }

  useEffect(() => {
    if (sequence.length > 0 && !gameOver) {
      playSequence()
    }
  }, [sequence, playSequence, gameOver])

  const calculateScore = () => {
    return score * 50 // 50 points per sequence completed
  }

  const handleSaveScore = (playerName: string) => {
    const finalScore = calculateScore()
    saveScore({
      id: generatePlayerId(),
      playerName,
      game: "simon-says",
      score: finalScore,
      details: `${score} secuencias completadas`,
      timestamp: Date.now(),
    })
    setShowNameModal(false)
  }

  // función para reproducir tono según color
  function playTone(frequency: number, duration = 400) {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = "sine"; // puedes probar "square" o "triangle"
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    oscillator.start();
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime); // volumen

    oscillator.stop(audioCtx.currentTime + duration / 1000);
  }


  if (gameOver && !showNameModal) {
    return (
      <GameLayout gameTitle="Simón Dice">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Trophy className="w-20 h-20 text-yellow-500" />
              </div>
              <CardTitle className="text-4xl text-white">¡Juego Terminado!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-6xl font-bold text-red-400">{score}</div>
              <div className="text-3xl font-bold text-green-400">{calculateScore()} puntos</div>
              <p className="text-2xl text-white/90">
                {score === 0
                  ? "¡Inténtalo de nuevo! 💪"
                  : score < 5
                    ? "¡Buen comienzo! 👏"
                    : score < 10
                      ? "¡Excelente memoria! 🧠"
                      : "¡Eres un maestro! 🎉"}
              </p>
              <p className="text-lg text-white/70">¡Tu puntuación ha sido guardada en el leaderboard!</p>
              <div className="flex gap-4 justify-center">
                <Button onClick={startGame} size="lg" className="text-xl py-6 px-8 bg-red-600 hover:bg-red-700">
                  <Play className="w-6 h-6 mr-2" />
                  Jugar de Nuevo
                </Button>
                <Button
                  onClick={resetGame}
                  size="lg"
                  variant="outline"
                  className="text-white border-white/30 bg-white/10 hover:bg-white/20"
                >
                  <RotateCcw className="w-6 h-6 mr-2" />
                  Reiniciar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </GameLayout>
    )
  }

  if (!isPlaying) {
    return (
      <GameLayout gameTitle="Simón Dice">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
            <CardHeader>
              <CardTitle className="text-4xl text-white">🎵 Simón Dice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-2xl text-white/90">Memoriza y repite la secuencia de colores que Simón te muestre</p>
              <div className="text-lg text-white/80 space-y-2">
                <p>🎯 Observa la secuencia de colores</p>
                <p>🖱️ Repite la secuencia haciendo clic en los colores</p>
                <p>📈 Cada ronda añade un nuevo color</p>
                <p>🏆 ¡Consigue la puntuación más alta!</p>
                <p className="text-green-400 font-bold">💰 50 puntos por secuencia completada</p>
              </div>
              <Button onClick={startGame} size="lg" className={`text-2xl py-8 px-12 bg-${brandingData.color}-600 hover:bg-${brandingData.color}-700`}>
                <Play className="w-8 h-8 mr-3" />
                ¡Comenzar Juego!
              </Button>
            </CardContent>
          </Card>
        </div>
      </GameLayout>
    )
  }

  return (
    <GameLayout gameTitle="Simón Dice">
      <PlayerNameModal isOpen={showNameModal} onSubmit={handleSaveScore} gameTitle="Simón Dice" />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-8 mb-6">
            <div className="text-2xl text-white/90">
              Puntuación: <span className="text-red-400 font-bold text-3xl">{calculateScore()}</span>
            </div>
            <div className="text-2xl text-white/90">
              Secuencia: <span className="text-blue-400 font-bold text-3xl">{sequence.length}</span>
            </div>
            <div className="text-2xl text-white/90">
              Nivel: <span className="text-green-400 font-bold text-3xl">{score}</span>
            </div>
          </div>

          <div className="text-xl text-white/80">
            {!isPlayerTurn ? "👀 Observa la secuencia..." : "🖱️ ¡Tu turno! Repite la secuencia"}
          </div>
        </div>

        <div className="relative w-[420px] h-[420px] mx-auto rounded-full shadow-[inset_0_8px_20px_rgba(255,255,255,0.3),inset_0_-8px_20px_rgba(0,0,0,0.6),0_12px_25px_rgba(0,0,0,0.8)] bg-black">
          {colors.map((color) => {
            let position = "";
            let rounded = "";

            if (color.id === 0) {
              position = "top-0 left-0";
              rounded = "rounded-tl-full";
            }
            if (color.id === 1) {
              position = "top-0 right-0";
              rounded = "rounded-tr-full";
            }
            if (color.id === 2) {
              position = "bottom-0 left-0";
              rounded = "rounded-bl-full";
            }
            if (color.id === 3) {
              position = "bottom-0 right-0";
              rounded = "rounded-br-full";
            }

            return (
              <button
                key={color.id}
                onClick={() => handleColorClick(color.id)}
                disabled={!isPlayerTurn}
                className={`absolute w-1/2 h-1/2 border-2 border-black/60 transition-all duration-200 hover:brightness-150 cursor-pointer ${rounded} ${position}
                  ${activeColor === color.id ? "brightness-150 scale-105 z-10 shadow-[0_0_25px_rgba(255,255,255,0.9)]" : ""}
                  ${!isPlayerTurn ? "cursor-not-allowed opacity-70" : "hover:brightness-110"}`}
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${color.color}, ${color.color}aa)`,
                }}
              />
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Button
            onClick={resetGame}
            variant="outline"
            size="lg"
            className="text-white border-white/30 bg-white/10 hover:bg-white/20"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reiniciar Juego
          </Button>
        </div>
      </div>
    </GameLayout>
  )
}
