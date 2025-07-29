import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import GameLayout from "@/components/game-layout"
import { CheckCircle, XCircle, Trophy } from "lucide-react"

const triviaQuestions = [
  {
    question: "¿En qué año se fundó Coca-Cola?",
    options: ["1885", "1886", "1887", "1888"],
    correct: 1,
  },
  {
    question: "¿Cuál es la capital de Francia?",
    options: ["Londres", "Berlín", "París", "Madrid"],
    correct: 2,
  },
  {
    question: "¿Qué planeta es conocido como el Planeta Rojo?",
    options: ["Venus", "Marte", "Júpiter", "Saturno"],
    correct: 1,
  },
  {
    question: "¿Cuánto es 2 + 2?",
    options: ["3", "4", "5", "6"],
    correct: 1,
  },
]

export default function TriviaGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowResult(true)

    if (answerIndex === triviaQuestions[currentQuestion].correct) {
      setScore(score + 1)
    }

    setTimeout(() => {
      if (currentQuestion < triviaQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        setGameFinished(true)
      }
    }, 2000)
  }

  const resetGame = () => {
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setGameFinished(false)
  }

  if (gameFinished) {
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
                {score}/{triviaQuestions.length}
              </div>
              <p className="text-2xl text-white/90">
                {score === triviaQuestions.length
                  ? "¡Puntuación Perfecta! 🎉"
                  : score >= triviaQuestions.length / 2
                    ? "¡Excelente Trabajo! 👏"
                    : "¡Sigue Practicando! 💪"}
              </p>
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl text-white/90">
              Pregunta {currentQuestion + 1} de {triviaQuestions.length}
            </span>
            <span className="text-2xl text-red-400 font-bold">Puntuación: {score}</span>
          </div>
          <Progress value={(currentQuestion / triviaQuestions.length) * 100} className="h-3" />
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-3xl text-white text-center">
              {triviaQuestions[currentQuestion].question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {triviaQuestions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  variant="outline"
                  className={`p-6 text-xl h-auto text-left justify-start ${
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
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    )}
                    {showResult && index === selectedAnswer && index !== triviaQuestions[currentQuestion].correct && (
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
