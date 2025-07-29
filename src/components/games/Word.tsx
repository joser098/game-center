import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import GameLayout from "@/components/game-layout"
import { Trophy, Clock, Zap } from "lucide-react"

const wordCategories = {
  Bebidas: ["COCACOLA", "REFRESCO", "BURBUJAS", "FELICIDAD", "COMPARTIR"],
  Animales: ["ELEFANTE", "JIRAFA", "PINGUINO", "DELFIN", "MARIPOSA"],
  Tecnología: ["COMPUTADORA", "INTERNET", "SOFTWARE", "TECLADO", "MONITOR"],
}

export default function WordGame() {
  const [currentCategory, setCurrentCategory] = useState("Bebidas")
  const [currentWord, setCurrentWord] = useState("")
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])
  const [wrongGuesses, setWrongGuesses] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [gameLost, setGameLost] = useState(false)
  const [score, setScore] = useState(0)
  const [inputValue, setInputValue] = useState("")

  const maxWrongGuesses = 6

  const initializeGame = () => {
    const categories = Object.keys(wordCategories)
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]
    const words = wordCategories[randomCategory as keyof typeof wordCategories]
    const randomWord = words[Math.floor(Math.random() * words.length)]

    setCurrentCategory(randomCategory)
    setCurrentWord(randomWord)
    setGuessedLetters([])
    setWrongGuesses(0)
    setGameWon(false)
    setGameLost(false)
    setInputValue("")
  }

  useEffect(() => {
    initializeGame()
  }, [])

  useEffect(() => {
    if (currentWord && guessedLetters.length > 0) {
      const wordLetters = currentWord.split("")
      const isWordComplete = wordLetters.every((letter) => guessedLetters.includes(letter))

      if (isWordComplete) {
        setGameWon(true)
        setScore((prev) => prev + (10 - wrongGuesses))
      }
    }
  }, [guessedLetters, currentWord, wrongGuesses])

  useEffect(() => {
    if (wrongGuesses >= maxWrongGuesses) {
      setGameLost(true)
    }
  }, [wrongGuesses])

  const handleGuess = (letter: string) => {
    if (guessedLetters.includes(letter) || gameWon || gameLost) return

    const upperLetter = letter.toUpperCase()
    setGuessedLetters((prev) => [...prev, upperLetter])

    if (!currentWord.includes(upperLetter)) {
      setWrongGuesses((prev) => prev + 1)
    }
  }

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.length === 1) {
      handleGuess(inputValue)
      setInputValue("")
    }
  }

  const displayWord = () => {
    return currentWord
      .split("")
      .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
      .join(" ")
  }

  const nextWord = () => {
    initializeGame()
  }

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

  return (
    <GameLayout gameTitle="Maestro de Palabras">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-2xl text-white/90">
            Puntuación: <span className="text-red-400 font-bold">{score}</span>
          </div>
          <div className="text-2xl text-white/90">
            Categoría: <span className="text-green-400 font-bold">{currentCategory}</span>
          </div>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-center">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Clock className="w-8 h-8 text-red-400" />
                <span className="text-3xl text-white">Adivina la Palabra</span>
                <Zap className="w-8 h-8 text-yellow-400" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="text-6xl font-mono font-bold text-red-400 tracking-wider">{displayWord()}</div>

            <div className="text-2xl text-white/90">
              Errores: {wrongGuesses} / {maxWrongGuesses}
            </div>

            {gameWon && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Trophy className="w-16 h-16 text-yellow-500" />
                </div>
                <p className="text-3xl text-green-400 font-bold">¡Felicitaciones! 🎉</p>
                <Button onClick={nextWord} size="lg" className="text-xl py-6 px-12 bg-green-600 hover:bg-green-700">
                  Siguiente Palabra
                </Button>
              </div>
            )}

            {gameLost && (
              <div className="space-y-4">
                <p className="text-3xl text-red-400 font-bold">¡Juego Terminado!</p>
                <p className="text-2xl text-white/90">
                  La palabra era: <span className="text-red-400 font-bold">{currentWord}</span>
                </p>
                <Button onClick={nextWord} size="lg" className="text-xl py-6 px-12 bg-red-600 hover:bg-red-700">
                  Intentar de Nuevo
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {!gameWon && !gameLost && (
          <>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
              <CardContent className="p-6">
                <form onSubmit={handleInputSubmit} className="flex space-x-4">
                  <Input
                    value={inputValue}
                    onChange={(e: any) => setInputValue(e.target.value.toUpperCase())}
                    placeholder="Ingresa una letra..."
                    maxLength={1}
                    className="text-2xl text-center bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  <Button type="submit" size="lg" className="px-8 bg-red-600 hover:bg-red-700">
                    Adivinar
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid grid-cols-6 md:grid-cols-13 gap-2">
              {alphabet.map((letter) => (
                <Button
                  key={letter}
                  onClick={() => handleGuess(letter)}
                  disabled={guessedLetters.includes(letter)}
                  variant={guessedLetters.includes(letter) ? "secondary" : "outline"}
                  className={`aspect-square text-xl font-bold ${
                    guessedLetters.includes(letter)
                      ? currentWord.includes(letter)
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                      : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  }`}
                >
                  {letter}
                </Button>
              ))}
            </div>
          </>
        )}
      </div>
    </GameLayout>
  )
}
