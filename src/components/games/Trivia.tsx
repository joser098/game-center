"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import GameLayout from "@/components/game-layout"
import PlayerNameModal from "@/components/player-name-modal"
import { CheckCircle, XCircle, Trophy } from "lucide-react"
import { saveScore, generatePlayerId } from "@/lib/leaderboard"
import BData from "@/utils/conts"
import brandingData from "@/utils/conts"

export default function TriviaGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [showNameModal, setShowNameModal] = useState(false)

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowResult(true)

    if (answerIndex === BData.triviaQuestions[currentQuestion].correct) {
      setScore(score + 1)
    }

    setTimeout(() => {
      if (currentQuestion < BData.triviaQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        setGameFinished(true)
        setShowNameModal(true)
      }
    }, 2000)
  }

  const handleSaveScore = (playerName: string) => {
    const finalScore = score * 100 // 100 points per correct answer
    saveScore({
      id: generatePlayerId(),
      playerName,
      game: "trivia",
      score: finalScore,
      details: `${score}/${BData.triviaQuestions.length} correctas`,
      timestamp: Date.now(),
    })
    setShowNameModal(false)
  }

  const resetGame = () => {
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setGameFinished(false)
    setShowNameModal(false)
  }

  if (gameFinished && !showNameModal) {
    return (
      <GameLayout gameTitle="Trivia Challenge">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Trophy className="w-20 h-20 text-yellow-500" />
              </div>
              <CardTitle className="text-4xl text-white">¡Juego Completado!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-6xl font-bold text-red-400">
                {score}/{BData.triviaQuestions.length}
              </div>
              <div className="text-3xl font-bold text-green-400">{score * 100} puntos</div>
              <p className="text-2xl text-white/90">
                {score === BData.triviaQuestions.length
                  ? "¡Puntuación Perfecta! 🎉"
                  : score >= BData.triviaQuestions.length / 2
                    ? "¡Excelente Trabajo! 👏"
                    : "¡Sigue Practicando! 💪"}
              </p>
              <p className="text-lg text-white/70">¡Tu puntuación ha sido guardada en el leaderboard!</p>
              <Button onClick={resetGame} size="lg" className="text-xl py-6 px-12 bg-red-600 hover:bg-red-700">
                Jugar de Nuevo
              </Button>
            </CardContent>
          </Card>
        </div>
      </GameLayout>
    )
  }

  return (
    <GameLayout gameTitle="Trivia Challenge">
      <PlayerNameModal isOpen={showNameModal} onSubmit={handleSaveScore} gameTitle="Trivia Challenge" />

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl text-white/90">
              Pregunta {currentQuestion + 1} de {BData.triviaQuestions.length}
            </span>
            <span className={`text-2xl text-${brandingData.color}-400 font-bold}`}>Puntuación: {score * 100}</span>
          </div>
          <Progress value={(currentQuestion / BData.triviaQuestions.length) * 100} className="h-3" />
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-3xl text-white text-center">
              {BData.triviaQuestions[currentQuestion].question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BData.triviaQuestions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  variant="outline"
                  className={`p-6 text-xl h-auto text-left justify-start ${
                    showResult
                      ? index === BData.triviaQuestions[currentQuestion].correct
                        ? "bg-green-600 border-green-500 text-white"
                        : index === selectedAnswer
                          ? "bg-red-600 border-red-500 text-white"
                          : "bg-white/10 border-white/20 text-white/70"
                      : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {showResult && index === BData.triviaQuestions[currentQuestion].correct && (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    )}
                    {showResult && index === selectedAnswer && index !== BData.triviaQuestions[currentQuestion].correct && (
                      <XCircle className="w-6 h-6 text-red-400" />
                    )}
                    <span>{option}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  )
}
