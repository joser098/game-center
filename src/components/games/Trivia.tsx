"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import GameLayout from "@/components/game-layout"
import PlayerNameModal from "@/components/player-name-modal"
import { CheckCircle, XCircle, Trophy } from "lucide-react"
import { saveScore, generatePlayerId } from "@/lib/leaderboard"
import BData from "@/utils/conts"
import brandingData from "@/utils/conts"
import defaults from "@/utils/defaults"

export default function TriviaGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [showNameModal, setShowNameModal] = useState(false)
  const [triviaQuestions, setTriviaQuestions] = useState(BData.triviaQuestions || defaults.triviaQuestions);
  const successSoundRef = useRef<HTMLAudioElement | null>(null)
  const failSoundRef = useRef<HTMLAudioElement | null>(null)
  
  // // Sonidos
  useEffect(() => {
    // Solo se ejecuta en el cliente
    successSoundRef.current = new Audio("/sounds/success.mp3")
    failSoundRef.current = new Audio("/sounds/fail.wav")
  }, [])

  const playFX = (success: boolean) => {
    if (success) {
      if (successSoundRef.current) {
        successSoundRef.current.currentTime = 0 // Reinicia el audio
        successSoundRef.current.play().catch(() => {})
      }
    } else {
      if (failSoundRef.current) {
        failSoundRef.current.currentTime = 0 // Reinicia el audio
        failSoundRef.current.play().catch(() => {})
      }
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowResult(true)

    if (answerIndex === triviaQuestions[currentQuestion].correct) {
      // PLAY DX SOUND
      playFX(true)
      setScore(score + 1)
    }

    // PLAY FX SOUND
    playFX(false)
    setTimeout(() => {
      if (currentQuestion < triviaQuestions.length - 1) {
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
      details: `${score}/${triviaQuestions.length} correctas`,
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
        <div className="max-w-8xl mx-auto text-center">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Trophy className="w-20 h-20 text-yellow-500" />
              </div>
              <CardTitle className="text-8xl text-white">¡Juego Completado!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="text-8xl font-bold text-red-400">
                {score}/{triviaQuestions.length}
              </div>
              <div className={`text-6xl font-bold text-${brandingData.color}-400`}>{score * 100} puntos</div>
              <p className="text-6xl text-white/90">
                {score === triviaQuestions.length
                  ? "¡Puntuación Perfecta! 🎉"
                  : score >= triviaQuestions.length / 2
                    ? "¡Excelente Trabajo! 👏"
                    : "¡Sigue Practicando! 💪"}
              </p>
              <p className="text-4xl text-white/70">¡Tu puntuación ha sido guardada en el leaderboard!</p>
              <Button onClick={resetGame} size="lg" className={`text-5xl py-6 px-12 bg-${brandingData.color}-600 hover:bg-${brandingData.color}-700`}>
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

      <div className="max-w-8xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-8 py-12">
            <span className="text-6xl font-bold text-white/90">
              Pregunta {currentQuestion + 1} de {triviaQuestions.length}
            </span>
            <span className={`text-6xl font-bold text-${brandingData.color}-400 font-bold}`}>Puntuación: {score * 100}</span>
          </div>
          <Progress value={(currentQuestion / triviaQuestions.length) * 100} className="h-10" />
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 py-12">
          <CardHeader>
            <CardTitle className="text-6xl text-white text-center py-12">
              {triviaQuestions[currentQuestion].question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-8">
              {triviaQuestions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  variant="outline"
                  className={`p-12 text-6xl h-auto text-left justify-start font-bold ${
                    showResult
                      ? index === triviaQuestions[currentQuestion].correct
                        ? "bg-green-600 border-green-500 text-white"
                        : index === selectedAnswer
                          ? "bg-red-600 border-red-500 text-white"
                          : "bg-white/10 border-white/20 text-white/70"
                      : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {showResult && index === triviaQuestions[currentQuestion].correct && (
                      <CheckCircle className="w-10 h-10 text-green-400" />
                    )}
                    {showResult && index === selectedAnswer && index !== triviaQuestions[currentQuestion].correct && (
                      <XCircle className="w-10 h-10 text-red-400" />
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
