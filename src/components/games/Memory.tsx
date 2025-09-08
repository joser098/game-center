"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import GameLayout from "@/components/game-layout"
import PlayerNameModal from "@/components/player-name-modal"
import { RotateCcw, Trophy } from "lucide-react"
import { saveScore, generatePlayerId } from "@/lib/leaderboard"
import brandingData from "@/utils/conts"

const cardSymbols = [
  "/1.png",
  "/2.png",
  "/3.png",
  "/4.png",
  "/5.png",
  "/6.png",
  "/7.png",
  "/8.png",
]

interface CardType {
  id: number
  symbol: string
  isFlipped: boolean
  isMatched: boolean
}

export default function MemoryGame() {
  const [cards, setCards] = useState<CardType[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [showNameModal, setShowNameModal] = useState(false)

  const [timeRemaining, setTimeRemaining] = useState(120) // 2 minutos
  const [gameOver, setGameOver] = useState(false)
  const [gameStartTime, setGameStartTime] = useState<number | null>(null)

  const initializeGame = () => {
    const gameCards: CardType[] = []
    cardSymbols.forEach((symbol, index) => {
      gameCards.push(
        { id: index * 2, symbol, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, symbol, isFlipped: false, isMatched: false },
      )
    })

    // Shuffle cards
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]]
    }

    setCards(gameCards)
    setFlippedCards([])
    setMoves(0)
    setGameWon(false)
    setShowNameModal(false)

    setTimeRemaining(120) // Resetear a 2 minutos
    setGameOver(false)
    setGameStartTime(Date.now())
  }

  useEffect(() => {
    initializeGame()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (gameStartTime && !gameWon && !gameOver && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setGameOver(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [gameStartTime, gameWon, gameOver, timeRemaining])

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards
      const firstCard = cards.find((card) => card.id === first)
      const secondCard = cards.find((card) => card.id === second)

      if (firstCard && secondCard && firstCard.symbol === secondCard.symbol) {
        // Match found
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) => (card.id === first || card.id === second ? { ...card, isMatched: true } : card)),
          )
          setFlippedCards([])
        }, 1000)
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) => (card.id === first || card.id === second ? { ...card, isFlipped: false } : card)),
          )
          setFlippedCards([])
        }, 1000)
      }
      setMoves((prev) => prev + 1)
    }
  }, [flippedCards, cards])

  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.isMatched)) {
      setGameWon(true)
      setShowNameModal(true)
    }
  }, [cards])

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2) return

    const card = cards.find((c) => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched) return

    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c)))
    setFlippedCards((prev) => [...prev, cardId])
  }

  const calculateScore = () => {
    // Base score of 1000, minus 20 points per move over 12
    const baseScore = 1000
    const penalty = Math.max(0, moves - 12) * 20
    return Math.max(100, baseScore - penalty)
  }

  const handleSaveScore = (playerName: string) => {
    const finalScore = calculateScore()
    saveScore({
      id: generatePlayerId(),
      playerName,
      game: "memory",
      score: finalScore,
      details: `${moves} movimientos`,
      timestamp: Date.now(),
    })
    setShowNameModal(false)
  }

  if (gameWon && !showNameModal) {
    return (
      <GameLayout gameTitle="Desafío de Memoria">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Trophy className="w-20 h-20 text-yellow-500" />
              </div>
              <CardTitle className="text-4xl text-white">¡Felicitaciones!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-6xl font-bold text-red-400">{moves} Movimientos</div>
              <div className="text-3xl font-bold text-green-400">{calculateScore()} puntos</div>
              <p className="text-2xl text-white/90">
                {moves <= 12 ? "¡Excelente Memoria! 🧠" : moves <= 20 ? "¡Buen Trabajo! 👏" : "¡Buen Esfuerzo! 💪"}
              </p>
              <p className="text-lg text-white/70">¡Tu puntuación ha sido guardada en el leaderboard!</p>
              <Button onClick={initializeGame} size="lg" className="text-xl py-6 px-12 bg-red-600 hover:bg-red-700">
                <RotateCcw className="w-6 h-6 mr-2" />
                Jugar de Nuevo
              </Button>
            </CardContent>
          </Card>
        </div>
      </GameLayout>
    )
  }

  return (
    <GameLayout gameTitle="Desafío de Memoria">
      <PlayerNameModal isOpen={showNameModal} onSubmit={handleSaveScore} gameTitle="Desafío de Memoria" />

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-2xl text-white/90">
            Movimientos: <span className="text-red-400 font-bold">{moves}</span>
          </div>
          <div className="text-2xl text-white/90">
            Puntuación: <span className="text-green-400 font-bold">{gameWon ? calculateScore() : "---"}</span>
          </div>
          <Button
            onClick={initializeGame}
            variant="outline"
            size="lg"
            className="text-white border-white/30 bg-white/10 hover:bg-white/20"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reiniciar Juego
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
          {cards.map((card) => (
            <Card
              key={card.id}
              // className={`aspect-square cursor-pointer transition-all duration-300 ${
              //   card.isFlipped || card.isMatched
              //     ? "bg-red-600 border-red-500"
              //     : "bg-white/10 border-white/20 hover:bg-white/20"
              // }`}
              className={`aspect-square cursor-pointer transition-all duration-300 ${
                card.isMatched
                  ? "bg-green-800 border-green-700" // ✅ verde si matchea
                  : card.isFlipped
                  ? `bg-${brandingData.color}-800 border-${brandingData.color}-700`   // 
                  : "bg-white/40 border-white/20 hover:bg-white/20"
              }`}
              
              onClick={() => handleCardClick(card.id)}
            >
              <CardContent className="flex items-center justify-center h-full p-0">
                <div
                  className={`relative w-full h-full preserve-3d transition-transform duration-500 ${
                    card.isFlipped || card.isMatched ? "rotate-y-180" : ""
                  }`}
                >
                  {/* Frente de la carta */}
                  <div className="absolute w-full h-full backface-hidden flex items-center justify-center rounded-2xl">
                    <img src={brandingData.logoUrl} alt="❓" className="h-20 w-20 object-contain" />
                  </div>

                  {/* Reverso de la carta */}
                  <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center rounded-2xl">
                    <img src={card.symbol} alt="card" className="h-24 w-24 object-contain" />
                  </div>
                </div>
              </CardContent>
              {/* <CardContent className="flex items-center justify-center h-full p-0">
                <div className="text-4xl">{card.isFlipped || card.isMatched ? (
                  <img src={`${card.symbol}`} alt="card" className="h-28 w-28 object-contain" />
                ): (
                  <img src={`${brandingData.logoUrl}`} alt="❓" />
                )
                  }</div>
              </CardContent> */}
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-xl text-white/80">¡Encuentra todas las parejas para ganar!</p>
          <p className="text-lg text-white/60 mt-2">Menos movimientos = más puntos</p>
        </div>
      </div>
    </GameLayout>
  )
}
