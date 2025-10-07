import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import GameLayout from "@/components/game-layout"
import PlayerNameModal from "@/components/player-name-modal"
import { Trophy, Play, Gift, Sparkles } from "lucide-react"
import { saveScore, generatePlayerId } from "@/lib/leaderboard"
import brandingData from "@/utils/conts"

const prizes = [
  { id: 1, name: "Coca-Cola 600ml", points: 100, color: "#E60012", emoji: "🥤" },
  { id: 2, name: "Camiseta Coca-Cola", points: 300, color: "#FF6B6B", emoji: "👕" },
  { id: 3, name: "Gorra Coca-Cola", points: 250, color: "#4ECDC4", emoji: "🧢" },
  { id: 4, name: "Botella Térmica", points: 400, color: "#45B7D1", emoji: "🍼" },
  { id: 5, name: "Pack 6 Coca-Colas", points: 500, color: "#96CEB4", emoji: "📦" },
  { id: 6, name: "Auriculares Coca-Cola", points: 600, color: "#FFEAA7", emoji: "🎧" },
  { id: 7, name: "Mochila Coca-Cola", points: 700, color: "#DDA0DD", emoji: "🎒" },
  { id: 8, name: "¡PREMIO ESPECIAL!", points: 1000, color: "#FFD700", emoji: "🏆" },
]

export default function GiftWheelGame() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentRotation, setCurrentRotation] = useState(0)
  const [selectedPrize, setSelectedPrize] = useState<typeof prizes[0] | null>(null)
  const [totalScore, setTotalScore] = useState(0)
  const [spinsUsed, setSpinsUsed] = useState(0)
  // const [maxSpins] = useState(5)
  const [gameFinished, setGameFinished] = useState(false)
  // const [showNameModal, setShowNameModal] = useState(false)
  const [wonPrizes, setWonPrizes] = useState<typeof prizes>([])
  const wheelRef = useRef<HTMLDivElement>(null)

  // // Sonidos
  // const clickSound = useRef(new Audio("/sounds/click.mp3"))
  // const winSound = useRef(new Audio("/sounds/win.mp3"))

  const spinWheel = () => {
    if (isSpinning) return
    setIsSpinning(true)
    setSelectedPrize(null)

    // Rotación aleatoria 4-6 giros completos
    const minRotation = 1440
    const maxRotation = 2160
    const randomRotation = Math.random() * (maxRotation - minRotation) + minRotation
    const finalRotation = currentRotation + randomRotation
    setCurrentRotation(finalRotation)

    // finalRotation: rotación total de la rueda
    const normalizedRotation = finalRotation % 360  // 0-359
    const prizeAngle = 360 / prizes.length

    // Ajustamos para que la flecha (que apunta hacia arriba, 270°) caiga en el sector correcto
    const arrowRotation = (360 - normalizedRotation + prizeAngle / 2) % 360

    // Calculamos el índice del premio
    const selectedIndex = Math.floor(arrowRotation / prizeAngle) % prizes.length
    const prize = prizes[selectedIndex]

    // Animación y sonidos
    let tickCount = 0
    const ticks = prizes.length * 4 // Número de “clics” antes de parar
    const tickInterval = setInterval(() => {
      // clickSound.current.play()
      tickCount++
      if (tickCount >= ticks) clearInterval(tickInterval)
    }, 100)

    setTimeout(() => {
      setSelectedPrize(prize)
      // winSound.current.play()
      setTotalScore((prev) => prev + prize.points)
      setWonPrizes((prev) => [...prev, prize])
      setSpinsUsed((prev) => {
        const newSpins = prev + 1
        // if (newSpins >= maxSpins) {
        //   // setTimeout(() => setShowNameModal(true), 1000)
        //   setGameFinished(true)
        // }
        return newSpins
      })
      setIsSpinning(false)
    }, 3000)
  }

  const resetGame = () => {
    setCurrentRotation(0)
    setSelectedPrize(null)
    setTotalScore(0)
    setSpinsUsed(0)
    setGameFinished(false)
    // setShowNameModal(false)
    setWonPrizes([])
    setIsSpinning(false)
  }

  // const handleSaveScore = (playerName: string) => {
  //   saveScore({
  //     id: generatePlayerId(),
  //     playerName,
  //     game: "gift-wheel",
  //     score: totalScore,
  //     details: `${wonPrizes.length} premios ganados`,
  //     timestamp: Date.now(),
  //   })
  //   setShowNameModal(false)
  // }

  const renderWheel = () => {
    const radius = 700
    const centerX = radius
    const centerY = radius
    const prizeAngle = 360 / prizes.length

    return (
      <div className="relative h-[1600px] mx-auto">
        <div
          className={`transition-transform duration-3000 ease-out rounded-full shadow-2xl`}
          style={{
            transform: `rotate(${currentRotation}deg)`,
            transitionDuration: isSpinning ? "3s" : "0s",
          }}
        >
          <svg width={radius * 2} height={radius * 2}>
            {prizes.map((prize, index) => {
              const startAngle = index * prizeAngle - 90
              const endAngle = (index + 1) * prizeAngle - 90
              const startAngleRad = (startAngle * Math.PI) / 180
              const endAngleRad = (endAngle * Math.PI) / 180

              const x1 = centerX + radius * 0.9 * Math.cos(startAngleRad)
              const y1 = centerY + radius * 0.9 * Math.sin(startAngleRad)
              const x2 = centerX + radius * 0.9 * Math.cos(endAngleRad)
              const y2 = centerY + radius * 0.9 * Math.sin(endAngleRad)

              const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius * 0.9} ${radius * 0.9} 0 0 1 ${x2} ${y2} Z`
              const textAngle = startAngle + prizeAngle / 2
              const textRadius = radius * 0.7
              const textX = centerX + textRadius * Math.cos((textAngle * Math.PI) / 180)
              const textY = centerY + textRadius * Math.sin((textAngle * Math.PI) / 180)

              return (
                <g key={prize.id} className="cursor-pointer hover:scale-105 transition-transform duration-300">
                  <defs>
                    <linearGradient id={`grad-${prize.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={prize.color} stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#000" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <path d={pathData} fill={`url(#grad-${prize.id})`} stroke="#fff" strokeWidth="3" />
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="24"
                    fontWeight="bold"
                    transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                  >
                    {prize.emoji}
                  </text>
                </g>
              )
            })}
          </svg>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-red-600 rounded-full border-4 border-white shadow-2xl flex items-center justify-center">
            <Gift className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Indicador fijo */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20 rotate-180">
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-red-600 drop-shadow-2xl"></div>
            <div className="w-12 h-12 bg-red-600 rounded-full border-2 border-white shadow-lg -mt-2"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <GameLayout gameTitle="Ruleta de Regalos">
      {/* <PlayerNameModal isOpen={showNameModal} onSubmit={handleSaveScore} gameTitle="Ruleta de Regalos" /> */}

      <div className="max-w-8xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-8">
              <h2 className="text-6xl font-bold text-white mb-2">🎡 Ruleta de Regalos Coca-Cola</h2>
              <p className="text-4xl text-white/80 mb-4">¡Gira la ruleta y gana increíbles premios!</p>
              {renderWheel()}
              <Button
                onClick={spinWheel}
                disabled={isSpinning}
                size="lg"
                className={`text-5xl py-6 px-12 bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.4)]`}
              >
                {isSpinning ? (
                  <>
                    <Sparkles className="w-6 h-6 mr-2 animate-spin" /> ¡Girando...!
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 mr-2" /> ¡Girar Ruleta!
                  </>
                )}
              </Button>
              {selectedPrize && !isSpinning && (
                <div className="mt-6 p-6 bg-gradient-to-r from-yellow-500 to-red-500 rounded-lg shadow-2xl animate-pulse text-center">
                  <div className="text-4xl mb-2">{selectedPrize.emoji}</div>
                  <div className="text-2xl font-bold text-white">{selectedPrize.name}</div>
                  <div className="text-xl text-green-400">+{selectedPrize.points} puntos</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  )
}
