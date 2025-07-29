import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import GameLayout from "@/components/game-layout"
import { RotateCcw, Trophy } from "lucide-react"

const cardSymbols = ["🥤", "🎉", "❄️", "🌟", "🎮", "🎯", "🎲", "🎪"]

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
  }

  useEffect(() => {
    initializeGame()
  }, [])

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
    }
  }, [cards])

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2) return

    const card = cards.find((c) => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched) return

    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c)))
    setFlippedCards((prev) => [...prev, cardId])
  }

  if (gameWon) {
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
              <p className="text-2xl text-white/90">
                {moves <= 12 ? "¡Excelente Memoria! 🧠" : moves <= 20 ? "¡Buen Trabajo! 👏" : "¡Buen Esfuerzo! 💪"}
              </p>
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
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-2xl text-white/90">
            Movimientos: <span className="text-red-400 font-bold">{moves}</span>
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
              className={`aspect-square cursor-pointer transition-all duration-300 ${
                card.isFlipped || card.isMatched
                  ? "bg-red-600 border-red-500"
                  : "bg-white/10 border-white/20 hover:bg-white/20"
              }`}
              onClick={() => handleCardClick(card.id)}
            >
              <CardContent className="flex items-center justify-center h-full p-0">
                <div className="text-4xl">{card.isFlipped || card.isMatched ? card.symbol : "❓"}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-xl text-white/80">¡Encuentra todas las parejas para ganar!</p>
        </div>
      </div>
    </GameLayout>
  )
}