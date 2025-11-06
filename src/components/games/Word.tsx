"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Clock, Zap } from "lucide-react"
import brandingData from "@/utils/conts"
import GameLayout from "@/components/game-layout"
import PlayerNameModal from "@/components/player-name-modal" //
import { saveScore, generatePlayerId } from "@/lib/leaderboard"

// helper para mezclar palabras y elegir 5
const getRandomWords = (words: string[], count: number) => {
  const shuffled = [...words].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map((w) => w.toUpperCase())
}

export default function WordGame() {
  const [currentCategory, setCurrentCategory] = useState("")
  const [currentWord, setCurrentWord] = useState("")
  const [remainingWords, setRemainingWords] = useState<string[]>([]) // palabras de la tanda
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])
  const [wrongGuesses, setWrongGuesses] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [gameLost, setGameLost] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [showCategorySelector, setShowCategorySelector] = useState(true)
  const [showPlayerNameModal, setShowPlayerNameModal] = useState(false)
  const successSoundRef = useRef<HTMLAudioElement | null>(null)
  const failSoundRef = useRef<HTMLAudioElement | null>(null)

  const maxWrongGuesses = 6
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
  const wordsPerGame = 5

  // Sonidos
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

  const initializeGame = (category?: string) => {
    const chosenCategory = category || currentCategory
    if (!chosenCategory) return

    const words = brandingData.wordCategories[chosenCategory as keyof typeof brandingData.wordCategories]
    const selectedWords = getRandomWords(words, wordsPerGame)

    const firstWord = selectedWords[0]
    const rest = selectedWords.slice(1)

    setCurrentCategory(chosenCategory)
    setCurrentWord(firstWord)
    setRemainingWords(rest)
    setGuessedLetters([])
    setWrongGuesses(0)
    setGameWon(false)
    setGameLost(false)
    setGameCompleted(false)
    setScore(0)
  }

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
      playFX(false)
      setWrongGuesses((prev) => prev + 1)
    }
    if(currentWord.includes(letter)){
      playFX(true)
    }
  }

  const displayWord = () =>
    currentWord
      .split("")
      .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
      .join(" ")

  const nextWord = () => {
    if (remainingWords.length === 0) {
      setGameCompleted(true)
      setShowPlayerNameModal(true)
      return
    }
    const [newWord, ...rest] = remainingWords
    setCurrentWord(newWord)
    setRemainingWords(rest)
    setGuessedLetters([])
    setWrongGuesses(0)
    setGameWon(false)
    setGameLost(false)
  }

  const handleSaveScore = (playerName: string) => {
    saveScore({
      id: generatePlayerId(),
      playerName,
      game: "word",
      score,
      details: `${currentCategory}, ${wordsPerGame} palabras`,
      timestamp: Date.now(),
    })
    setShowPlayerNameModal(false)
  }

  // 📌 Selector de categoría
  if (showCategorySelector) {
    return (
      <GameLayout gameTitle="Maestro de Palabras">
        <div className="max-w-8xl mx-auto text-center">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
            <CardHeader>
              <CardTitle className="text-6xl text-white">📚 Selecciona una Categoría</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <p className="text-2xl text-white/90">Elige la categoría de palabras que quieres adivinar</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {Object.entries(brandingData.wordCategories).map(([category, words]) => (
                  <Card
                    key={category}
                    className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:scale-105"
                    onClick={() => {
                      setShowCategorySelector(false)
                      initializeGame(category)
                    }}
                  >
                    <CardContent className="p-12 text-center">
                      <h3 className="text-6xl font-bold text-white mb-2">{category}</h3>
                      <p className="text-white/80 mb-8 text-4xl">{words.length} palabras disponibles</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </GameLayout>
    )
  }

  // 📌 Pantalla final (terminó tanda de 5)
  if (gameCompleted) {
    return (
      <GameLayout gameTitle="Maestro de Palabras">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8">
            <CardContent className="space-y-6">
              <Trophy className="w-20 h-20 text-yellow-400 mx-auto" />
              <p className="text-4xl font-bold text-green-400">¡Ganaste la tanda! 🎉</p>
              <p className="text-2xl text-white/90">Tu puntuación final: {score}</p>
              <Button
                onClick={() => setShowCategorySelector(true)}
                className="text-xl py-6 px-12 bg-green-600 hover:bg-green-700"
              >
                Volver a Jugar
              </Button>
            </CardContent>
          </Card>
          {showPlayerNameModal && (
            <PlayerNameModal
              isOpen={showPlayerNameModal}
              onSubmit={handleSaveScore}
              gameTitle="Maestro de Palabras"
            />
          )}
        </div>
      </GameLayout>
    )
  }

  // 📌 Juego normal
  return (
    <GameLayout gameTitle="Maestro de Palabras">
      <div className="max-w-8xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-5xl text-white/90">
            Puntuación: <span className={`text-${brandingData.color}-400 font-bold`}>{score}</span>
          </div>
          <div className="text-5xl text-white/90">
            Categoría: <span className="text-green-400 font-bold">{currentCategory}</span>
          </div>
          <div className="text-5xl text-white/90">
            Palabras restantes: <span className="text-yellow-400 font-bold">{remainingWords.length + 1}</span>
          </div>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-center">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Clock className={`w-12 h-12 text-${brandingData.color}-400`} />
                <span className="text-5xl text-white">Adivina la Palabra</span>
                <Zap className="w-12 h-12 text-yellow-400" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className={`text-8xl font-mono font-bold text-${brandingData.color}-400 tracking-wider`}>
              {displayWord()}
            </div>

            <div className="text-4xl text-white/90">
              Errores: {wrongGuesses} / {maxWrongGuesses}
            </div>

            {gameWon && (
              <div className="space-y-4">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto" />
                <p className="text-6xl text-green-400 font-bold">¡Correcto! 🎉</p>
                <Button onClick={nextWord} size="lg" className="text-3xl py-6 px-12 bg-green-600 shadow-2xl hover:bg-green-700">
                  Siguiente Palabra
                </Button>
              </div>
            )}

            {gameLost && (
              <div className="space-y-8">
                <p className={`text-6xl text-red-400 font-bold`}>¡Fallaste!</p>
                <p className="text-4xl text-white/90">
                  La palabra era: <span className={`text-${brandingData.color}-400 font-bold`}>{currentWord}</span>
                </p>
                <Button
                  onClick={nextWord}
                  size="lg"
                  className={`text-3xl py-6 px-12 bg-${brandingData.color}-600 shadow-2xl hover:bg-${brandingData.color}-700`}
                >
                  Intentar Siguiente
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {!gameWon && !gameLost && (
          <div className="grid grid-cols-6 md:grid-cols-13 gap-4">
            {alphabet.map((letter) => (
              <Button
                key={letter}
                onClick={() => handleGuess(letter)}
                disabled={guessedLetters.includes(letter)}
                variant={guessedLetters.includes(letter) ? "secondary" : "outline"}
                className={`aspect-square text-6xl font-bold h-28 ${
                  guessedLetters.includes(letter)
                    ? currentWord.includes(letter)
                      ? "bg-green-600 text-white"
                      : `bg-${brandingData.color}-600 text-white`
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                }`}
              >
                {letter}
              </Button>
            ))}
          </div>
        )}
      </div>
    </GameLayout>
  )
}
