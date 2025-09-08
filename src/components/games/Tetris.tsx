"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import GameLayout from "@/components/game-layout"
import PlayerNameModal from "@/components/player-name-modal"
import { Trophy, Play, RotateCcw, Pause, ArrowDown, ArrowLeft, ArrowRight, RotateCw } from "lucide-react"
import { saveScore, generatePlayerId } from "@/lib/leaderboard"

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const TETROMINOS = {
  I: { shape: [[1, 1, 1, 1]], color: "#00f0f0" },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "#f0f000",
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: "#a000f0",
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: "#00f000",
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: "#f00000",
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: "#0000f0",
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: "#f0a000",
  },
}

type TetrominoType = keyof typeof TETROMINOS
type Board = (string | null)[][]

interface Piece {
  shape: number[][]
  x: number
  y: number
  color: string
  type: TetrominoType
}

export default function TetrisGame() {
  const [board, setBoard] = useState<Board>(() =>
    Array(BOARD_HEIGHT)
      .fill(null)
      .map(() => Array(BOARD_WIDTH).fill(null)),
  )
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null)
  const [nextPiece, setNextPiece] = useState<Piece | null>(null)
  const [score, setScore] = useState(0)
  const [lines, setLines] = useState(0)
  const [level, setLevel] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showNameModal, setShowNameModal] = useState(false)
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)

  const createRandomPiece = useCallback((): Piece => {
    const types = Object.keys(TETROMINOS) as TetrominoType[]
    const type = types[Math.floor(Math.random() * types.length)]
    const tetromino = TETROMINOS[type]

    return {
      shape: tetromino.shape,
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(tetromino.shape[0].length / 2),
      y: 0,
      color: tetromino.color,
      type,
    }
  }, [])

  const rotatePiece = (piece: Piece): Piece => {
    const rotated = piece.shape[0].map((_, index) => piece.shape.map((row) => row[index]).reverse())
    return { ...piece, shape: rotated }
  }

  const isValidPosition = useCallback((piece: Piece, board: Board, dx = 0, dy = 0): boolean => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.x + x + dx
          const newY = piece.y + y + dy

          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return false
          }

          if (newY >= 0 && board[newY][newX]) {
            return false
          }
        }
      }
    }
    return true
  }, [])

  const placePiece = useCallback((piece: Piece, board: Board): Board => {
    const newBoard = board.map((row) => [...row])

    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardY = piece.y + y
          const boardX = piece.x + x
          if (boardY >= 0) {
            newBoard[boardY][boardX] = piece.color
          }
        }
      }
    }

    return newBoard
  }, [])

  const clearLines = useCallback((board: Board): { newBoard: Board; linesCleared: number } => {
    const newBoard = board.filter((row) => row.some((cell) => cell === null))
    const linesCleared = BOARD_HEIGHT - newBoard.length

    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(null))
    }

    return { newBoard, linesCleared }
  }, [])

  const movePiece = useCallback(
    (dx: number, dy: number) => {
      if (!currentPiece || gameOver || isPaused) return

      if (isValidPosition(currentPiece, board, dx, dy)) {
        setCurrentPiece((prev) => (prev ? { ...prev, x: prev.x + dx, y: prev.y + dy } : null))
      } else if (dy > 0) {
        // Piece can't move down, place it
        const newBoard = placePiece(currentPiece, board)
        const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard)

        setBoard(clearedBoard)
        setLines((prev) => prev + linesCleared)
        setScore((prev) => prev + linesCleared * 100 * level + 10)

        // Check for game over
        if (nextPiece && !isValidPosition(nextPiece, clearedBoard)) {
          setGameOver(true)
          setShowNameModal(true)
        } else {
          setCurrentPiece(nextPiece)
          setNextPiece(createRandomPiece())
        }
      }
    },
    [
      currentPiece,
      board,
      gameOver,
      isPaused,
      isValidPosition,
      placePiece,
      clearLines,
      level,
      nextPiece,
      createRandomPiece,
    ],
  )

  const rotatePieceHandler = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return

    const rotated = rotatePiece(currentPiece)
    if (isValidPosition(rotated, board)) {
      setCurrentPiece(rotated)
    }
  }, [currentPiece, gameOver, isPaused, board, isValidPosition])

  const startGame = () => {
    const newBoard = Array(BOARD_HEIGHT)
      .fill(null)
      .map(() => Array(BOARD_WIDTH).fill(null))
    const firstPiece = createRandomPiece()
    const secondPiece = createRandomPiece()

    setBoard(newBoard)
    setCurrentPiece(firstPiece)
    setNextPiece(secondPiece)
    setScore(0)
    setLines(0)
    setLevel(1)
    setGameOver(false)
    setIsPaused(false)
    setIsPlaying(true)
    setShowNameModal(false)
  }

  const resetGame = () => {
    setIsPlaying(false)
    setGameOver(false)
    setIsPaused(false)
    setShowNameModal(false)
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current)
    }
  }

  const togglePause = () => {
    setIsPaused((prev) => !prev)
  }

  const handleSaveScore = (playerName: string) => {
    saveScore({
      id: generatePlayerId(),
      playerName,
      game: "tetris",
      score: score,
      details: `${lines} líneas, nivel ${level}`,
      timestamp: Date.now(),
    })
    setShowNameModal(false)
  }

  // Game loop
  useEffect(() => {
    if (isPlaying && !gameOver && !isPaused) {
      const speed = Math.max(100, 1000 - (level - 1) * 100)
      gameLoopRef.current = setInterval(() => {
        movePiece(0, 1)
      }, speed)
    } else if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current)
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [isPlaying, gameOver, isPaused, level, movePiece])

  // Level up
  useEffect(() => {
    setLevel(Math.floor(lines / 10) + 1)
  }, [lines])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault()
          movePiece(-1, 0)
          break
        case "ArrowRight":
          e.preventDefault()
          movePiece(1, 0)
          break
        case "ArrowDown":
          e.preventDefault()
          movePiece(0, 1)
          break
        case "ArrowUp":
        case " ":
          e.preventDefault()
          rotatePieceHandler()
          break
        case "p":
        case "P":
          e.preventDefault()
          togglePause()
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isPlaying, gameOver, movePiece, rotatePieceHandler])

  const renderBoard = () => {
    const displayBoard = board.map((row) => [...row])

    // Add current piece to display board
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPiece.y + y
            const boardX = currentPiece.x + x
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.color
            }
          }
        }
      }
    }

    return displayBoard.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <div
            key={x}
            className="w-6 h-6 border border-gray-600"
            style={{
              backgroundColor: cell || "#1a1a1a",
            }}
          />
        ))}
      </div>
    ))
  }

  const renderNextPiece = () => {
    if (!nextPiece) return null

    return (
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(4, 1fr)` }}>
        {Array(4)
          .fill(null)
          .map((_, y) =>
            Array(4)
              .fill(null)
              .map((_, x) => {
                const hasBlock = nextPiece.shape[y] && nextPiece.shape[y][x]
                return (
                  <div
                    key={`${y}-${x}`}
                    className="w-4 h-4 border border-gray-700"
                    style={{
                      backgroundColor: hasBlock ? nextPiece.color : "#1a1a1a",
                    }}
                  />
                )
              }),
          )}
      </div>
    )
  }

  if (gameOver && !showNameModal) {
    return (
      <GameLayout gameTitle="Tetris">
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
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">{lines}</div>
                  <div className="text-white/80">Líneas</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">{level}</div>
                  <div className="text-white/80">Nivel</div>
                </div>
              </div>
              <p className="text-2xl text-white/90">
                {score >= 10000
                  ? "¡Maestro del Tetris! 🏆"
                  : score >= 5000
                    ? "¡Excelente juego! 🎉"
                    : "¡Buen intento! 💪"}
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
                  Menú Principal
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
      <GameLayout gameTitle="Tetris">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
            <CardHeader>
              <CardTitle className="text-4xl text-white">🧩 Tetris</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-2xl text-white/90">El clásico juego de bloques que caen</p>
              <div className="text-lg text-white/80 space-y-2">
                <p>🎯 Completa líneas horizontales para eliminarlas</p>
                <p>⬅️➡️ Usa las flechas para mover las piezas</p>
                <p>⬇️ Flecha abajo para acelerar la caída</p>
                <p>🔄 Flecha arriba o Espacio para rotar</p>
                <p>⏸️ Presiona 'P' para pausar</p>
                <p className="text-green-400 font-bold">💰 10 puntos por pieza + 100 × líneas × nivel</p>
              </div>
              <Button onClick={startGame} size="lg" className="text-2xl py-8 px-12 bg-red-600 hover:bg-red-700">
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
    <GameLayout gameTitle="Tetris">
      <PlayerNameModal isOpen={showNameModal} onSubmit={handleSaveScore} gameTitle="Tetris" />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Board */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="flex justify-center">
                  <div className="bg-black p-4 rounded-lg border-2 border-gray-600">{renderBoard()}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Game Info */}
          <div className="space-y-6">
            {/* Score */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl text-white text-center">Puntuación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-400">{score}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 p-3 rounded-lg text-center">
                    <div className="text-xl font-bold text-blue-400">{lines}</div>
                    <div className="text-white/80 text-sm">Líneas</div>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg text-center">
                    <div className="text-xl font-bold text-green-400">{level}</div>
                    <div className="text-white/80 text-sm">Nivel</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Piece */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-xl text-white text-center">Siguiente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div className="bg-black p-4 rounded-lg">{renderNextPiece()}</div>
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-xl text-white text-center">Controles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => movePiece(-1, 0)}
                    variant="outline"
                    className="text-white border-white/30 bg-white/10 hover:bg-white/20"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => movePiece(1, 0)}
                    variant="outline"
                    className="text-white border-white/30 bg-white/10 hover:bg-white/20"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => movePiece(0, 1)}
                    variant="outline"
                    className="text-white border-white/30 bg-white/10 hover:bg-white/20"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={rotatePieceHandler}
                    variant="outline"
                    className="text-white border-white/30 bg-white/10 hover:bg-white/20"
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                </div>
                <Button onClick={togglePause} className="w-full bg-yellow-600 hover:bg-yellow-700">
                  <Pause className="w-4 h-4 mr-2" />
                  {isPaused ? "Reanudar" : "Pausar"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {isPaused && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-8 text-center">
                <h2 className="text-4xl text-white mb-4">⏸️ Juego Pausado</h2>
                <p className="text-xl text-white/80 mb-6">Presiona 'P' o el botón para continuar</p>
                <Button onClick={togglePause} size="lg" className="bg-red-600 hover:bg-red-700">
                  <Play className="w-6 h-6 mr-2" />
                  Reanudar
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </GameLayout>
  )
}
