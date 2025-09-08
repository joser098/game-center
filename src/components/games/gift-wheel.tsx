import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import GameLayout from "@/components/game-layout"
import PlayerNameModal from "@/components/player-name-modal"
import { Trophy, Play, Gift, Sparkles } from "lucide-react"
import { saveScore, generatePlayerId } from "@/lib/leaderboard"

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
  const [selectedPrize, setSelectedPrize] = useState<(typeof prizes)[0] | null>(null)
  const [totalScore, setTotalScore] = useState(0)
  const [spinsUsed, setSpinsUsed] = useState(0)
  const [maxSpins] = useState(5)
  const [gameFinished, setGameFinished] = useState(false)
  const [showNameModal, setShowNameModal] = useState(false)
  const [wonPrizes, setWonPrizes] = useState<typeof prizes>([])
  const wheelRef = useRef<HTMLDivElement>(null)

  const spinWheel = () => {
    if (isSpinning || spinsUsed >= maxSpins) return

    setIsSpinning(true)
    setSelectedPrize(null)

    // Random rotation between 1440 and 2160 degrees (4-6 full rotations)
    const minRotation = 1440
    const maxRotation = 2160
    const randomRotation = Math.random() * (maxRotation - minRotation) + minRotation
    const finalRotation = currentRotation + randomRotation

    setCurrentRotation(finalRotation)

    // Calculate which prize was selected
    // La flecha apunta a las 12 (270 grados en nuestro sistema)
    // Necesitamos ajustar para que el cálculo sea correcto
    const normalizedRotation = (360 - (finalRotation % 360)) % 360
    const prizeAngle = 360 / prizes.length
    // Ajustamos para que la flecha apunte correctamente a las 12
    const adjustedRotation = (normalizedRotation + 90) % 360
    const selectedIndex = Math.floor(adjustedRotation / prizeAngle) % prizes.length
    const prize = prizes[selectedIndex]

    setTimeout(() => {
      setSelectedPrize(prize)
      setTotalScore((prev) => prev + prize.points)
      setWonPrizes((prev) => [...prev, prize])
      setSpinsUsed((prev) => prev + 1)
      setIsSpinning(false)

      // Check if game is finished
      if (spinsUsed + 1 >= maxSpins) {
        setTimeout(() => {
          setGameFinished(true)
          setShowNameModal(true)
        }, 2000)
      }
    }, 3000)
  }

  const resetGame = () => {
    setCurrentRotation(0)
    setSelectedPrize(null)
    setTotalScore(0)
    setSpinsUsed(0)
    setGameFinished(false)
    setShowNameModal(false)
    setWonPrizes([])
    setIsSpinning(false)
  }

  const handleSaveScore = (playerName: string) => {
    saveScore({
      id: generatePlayerId(),
      playerName,
      game: "gift-wheel",
      score: totalScore,
      details: `${wonPrizes.length} premios ganados`,
      timestamp: Date.now(),
    })
    setShowNameModal(false)
  }

  const renderWheel = () => {
    const radius = 200
    const centerX = radius
    const centerY = radius
    const prizeAngle = 360 / prizes.length

    return (
      <div className="relative">
        {/* Rueda que gira */}
        <div
          className="transition-transform duration-3000 ease-out"
          style={{
            transform: `rotate(${currentRotation}deg)`,
            transitionDuration: isSpinning ? "3s" : "0s",
          }}
        >
          <svg width={radius * 2} height={radius * 2} className="drop-shadow-2xl">
            {prizes.map((prize, index) => {
              const startAngle = index * prizeAngle - 90 // Empezar desde las 12 (270 grados)
              const endAngle = (index + 1) * prizeAngle - 90
              const startAngleRad = (startAngle * Math.PI) / 180
              const endAngleRad = (endAngle * Math.PI) / 180

              const x1 = centerX + radius * 0.9 * Math.cos(startAngleRad)
              const y1 = centerY + radius * 0.9 * Math.sin(startAngleRad)
              const x2 = centerX + radius * 0.9 * Math.cos(endAngleRad)
              const y2 = centerY + radius * 0.9 * Math.sin(endAngleRad)

              const largeArcFlag = prizeAngle > 180 ? 1 : 0

              const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${x1} ${y1}`,
                `A ${radius * 0.9} ${radius * 0.9} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                "Z",
              ].join(" ")

              const textAngle = startAngle + prizeAngle / 2
              const textRadius = radius * 0.7
              const textX = centerX + textRadius * Math.cos((textAngle * Math.PI) / 180)
              const textY = centerY + textRadius * Math.sin((textAngle * Math.PI) / 180)

              return (
                <g key={prize.id}>
                  <path
                    d={pathData}
                    fill={prize.color}
                    stroke="#fff"
                    strokeWidth="3"
                    className="transition-all duration-300"
                  />
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

          {/* Center circle - también gira con la rueda */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-red-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
            <Gift className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Indicador FIJO - NO gira */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex flex-col items-center">
            {/* Flecha principal */}
            <div className="w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-red-600 drop-shadow-2xl"></div>
            {/* Círculo decorativo */}
            <div className="w-6 h-6 bg-red-600 rounded-full border-3 border-white shadow-lg -mt-2"></div>
          </div>
        </div>

        {/* Línea de referencia adicional - FIJA */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-12 bg-red-600 shadow-lg z-10 rounded-b-lg"></div>
      </div>
    )
  }

  if (gameFinished && !showNameModal) {
    return (
      <GameLayout gameTitle="Ruleta de Regalos">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Trophy className="w-20 h-20 text-yellow-500" />
              </div>
              <CardTitle className="text-4xl text-white">¡Juego Completado!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-6xl font-bold text-red-400">{totalScore}</div>
              <div className="text-2xl text-white/90">¡Puntos Totales Ganados!</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-green-400">{wonPrizes.length}</div>
                  <div className="text-white/80">Premios Ganados</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-blue-400">{spinsUsed}</div>
                  <div className="text-white/80">Giros Usados</div>
                </div>
              </div>

              <div className="bg-white/10 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-white mb-4">🎁 Tus Premios:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {wonPrizes.map((prize, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{prize.emoji}</span>
                        <span className="text-white">{prize.name}</span>
                      </div>
                      <span className="text-green-400 font-bold">{prize.points} pts</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-lg text-white/70">¡Tu puntuación ha sido guardada en el leaderboard!</p>
              <Button onClick={resetGame} size="lg" className="text-xl py-6 px-12 bg-red-600 hover:bg-red-700">
                <Play className="w-6 h-6 mr-2" />
                Jugar de Nuevo
              </Button>
            </CardContent>
          </Card>
        </div>
      </GameLayout>
    )
  }

  return (
    <GameLayout gameTitle="Ruleta de Regalos">
      <PlayerNameModal isOpen={showNameModal} onSubmit={handleSaveScore} gameTitle="Ruleta de Regalos" />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Wheel */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-8">
                <div className="flex flex-col items-center space-y-8">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">🎡 Ruleta de Regalos Coca-Cola</h2>
                    <p className="text-lg text-white/80">¡Gira la ruleta y gana increíbles premios!</p>
                  </div>

                  <div className="relative">{renderWheel()}</div>

                  <div className="text-center space-y-4">
                    <Button
                      onClick={spinWheel}
                      disabled={isSpinning || spinsUsed >= maxSpins}
                      size="lg"
                      className="text-2xl py-6 px-12 bg-red-600 hover:bg-red-700 disabled:opacity-50"
                    >
                      {isSpinning ? (
                        <>
                          <Sparkles className="w-6 h-6 mr-2 animate-spin" />
                          ¡Girando...!
                        </>
                      ) : spinsUsed >= maxSpins ? (
                        "¡Juego Terminado!"
                      ) : (
                        <>
                          <Play className="w-6 h-6 mr-2" />
                          ¡Girar Ruleta!
                        </>
                      )}
                    </Button>

                    {selectedPrize && !isSpinning && (
                      <div className="absolute h-40 top-1/2 bg-gradient-to-r from-yellow-500 to-red-500 border border-yellow-500 p-6 rounded-lg animate-pulse">
                        <div className="text-4xl mb-2">{selectedPrize.emoji}</div>
                        <div className="text-2xl font-bold text-white">{selectedPrize.name}</div>
                        <div className="text-xl text-green-400">+{selectedPrize.points} puntos</div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </GameLayout>
  )
}
