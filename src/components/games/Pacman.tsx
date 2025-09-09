import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import GameLayout from "@/components/game-layout"
import PlayerNameModal from "@/components/player-name-modal"
import { Trophy, Play, RotateCcw, Pause, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react"
import { saveScore, generatePlayerId } from "@/lib/leaderboard"
import brandingData from "@/utils/conts"

const BOARD_WIDTH = 19
const BOARD_HEIGHT = 21
const CELL_SIZE = 20

// Simple maze layout (1 = wall, 0 = dot, 2 = power pellet, 3 = empty)
const INITIAL_MAZE = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 2, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 2, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 0, 1, 1, 1, 3, 1, 3, 1, 1, 1, 0, 1, 1, 1, 1],
  [3, 3, 3, 1, 0, 1, 3, 3, 3, 3, 3, 3, 3, 1, 0, 1, 3, 3, 3],
  [1, 1, 1, 1, 0, 1, 3, 1, 1, 3, 1, 1, 3, 1, 0, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 3, 3, 1, 3, 3, 3, 1, 3, 3, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 0, 1, 3, 1, 1, 1, 1, 1, 3, 1, 0, 1, 1, 1, 1],
  [3, 3, 3, 1, 0, 1, 3, 3, 3, 3, 3, 3, 3, 1, 0, 1, 3, 3, 3],
  [1, 1, 1, 1, 0, 1, 1, 1, 3, 1, 3, 1, 1, 1, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 1],
  [1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

interface Position {
  x: number
  y: number
}

interface Ghost {
  x: number
  y: number
  color: string
  direction: string
}

export default function PacmanGame() {
  const [maze, setMaze] = useState(INITIAL_MAZE.map((row) => [...row]))
  const [pacman, setPacman] = useState<Position>({ x: 9, y: 15 })
  const [ghosts, setGhosts] = useState<Ghost[]>([
    { x: 9, y: 9, color: "#ff0000", direction: "up" },
    { x: 8, y: 9, color: "#ffb8ff", direction: "down" },
    { x: 10, y: 9, color: "#00ffff", direction: "left" },
    { x: 9, y: 10, color: "#ffb852", direction: "right" },
  ])
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showNameModal, setShowNameModal] = useState(false)
  const [powerMode, setPowerMode] = useState(false)
  const [powerModeTimer, setPowerModeTimer] = useState(0)
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)
  const powerTimerRef = useRef<NodeJS.Timeout | null>(null)

  const directions = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  }

  const isValidMove = useCallback(
    (x: number, y: number): boolean => {
      if (x < 0 || x >= BOARD_WIDTH || y < 0 || y >= BOARD_HEIGHT) {
        return false
      }
      return maze[y][x] !== 1
    },
    [maze],
  )

  const movePacman = useCallback(
    (direction: keyof typeof directions) => {
      if (!isPlaying || gameOver || isPaused) return

      const { x: dx, y: dy } = directions[direction]
      const newX = pacman.x + dx
      const newY = pacman.y + dy

      if (isValidMove(newX, newY)) {
        setPacman({ x: newX, y: newY })

        // Check for dots and power pellets
        const cell = maze[newY][newX]
        if (cell === 0) {
          setScore((prev) => prev + 10)
          setMaze((prev) => {
            const newMaze = prev.map((row) => [...row])
            newMaze[newY][newX] = 3
            return newMaze
          })
        } else if (cell === 2) {
          setScore((prev) => prev + 50)
          setPowerMode(true)
          setPowerModeTimer(10)
          setMaze((prev) => {
            const newMaze = prev.map((row) => [...row])
            newMaze[newY][newX] = 3
            return newMaze
          })
        }
      }
    },
    [pacman, isPlaying, gameOver, isPaused, isValidMove, maze],
  )

  const moveGhosts = useCallback(() => {
    if (!isPlaying || gameOver || isPaused) return

    setGhosts((prev) =>
      prev.map((ghost) => {
        const possibleDirections = Object.keys(directions) as (keyof typeof directions)[]
        const validDirections = possibleDirections.filter((dir) => {
          const { x: dx, y: dy } = directions[dir]
          return isValidMove(ghost.x + dx, ghost.y + dy)
        })

        if (validDirections.length === 0) return ghost

        // Simple AI: random direction from valid ones
        const newDirection = validDirections[Math.floor(Math.random() * validDirections.length)]
        const { x: dx, y: dy } = directions[newDirection]

        return {
          ...ghost,
          x: ghost.x + dx,
          y: ghost.y + dy,
          direction: newDirection,
        }
      }),
    )
  }, [isPlaying, gameOver, isPaused, isValidMove])

  const startGame = () => {
    setMaze(INITIAL_MAZE.map((row) => [...row]))
    setPacman({ x: 9, y: 15 })
    setGhosts([
      { x: 9, y: 9, color: "#ff0000", direction: "up" },
      { x: 8, y: 9, color: "#ffb8ff", direction: "down" },
      { x: 10, y: 9, color: "#00ffff", direction: "left" },
      { x: 9, y: 10, color: "#ffb852", direction: "right" },
    ])
    setScore(0)
    setLives(3)
    setGameOver(false)
    setGameWon(false)
    setIsPaused(false)
    setIsPlaying(true)
    setShowNameModal(false)
    setPowerMode(false)
    setPowerModeTimer(0)
  }

  const resetGame = () => {
    setIsPlaying(false)
    setGameOver(false)
    setGameWon(false)
    setIsPaused(false)
    setShowNameModal(false)
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current)
    }
    if (powerTimerRef.current) {
      clearInterval(powerTimerRef.current)
    }
  }

  const togglePause = () => {
    setIsPaused((prev) => !prev)
  }

  const handleSaveScore = (playerName: string) => {
    const finalScore = score + (gameWon ? 1000 : 0) // Bonus for completing the game
    saveScore({
      id: generatePlayerId(),
      playerName,
      game: "pacman",
      score: finalScore,
      details: gameWon ? "Juego completado" : `${lives} vidas restantes`,
      timestamp: Date.now(),
    })
    setShowNameModal(false)
  }

  // Game loop with collision checking
  useEffect(() => {
    if (isPlaying && !gameOver && !isPaused) {
      gameLoopRef.current = setInterval(() => {
        moveGhosts()

        // Check collisions after ghost movement
        setGhosts((currentGhosts) => {
          setPacman((currentPacman) => {
            // Check for collisions
            currentGhosts.forEach((ghost) => {
              if (ghost.x === currentPacman.x && ghost.y === currentPacman.y) {
                if (powerMode) {
                  setScore((prev) => prev + 200)
                  // Reset this ghost position
                  setGhosts((prev) => prev.map((g) => (g === ghost ? { ...g, x: 9, y: 9 } : g)))
                } else {
                  // Pac-Man loses a life
                  setLives((prev) => {
                    const newLives = prev - 1
                    if (newLives <= 0) {
                      setGameOver(true)
                      setShowNameModal(true)
                    } else {
                      // Reset Pac-Man position after losing a life
                      setTimeout(() => {
                        setPacman({ x: 9, y: 15 })
                      }, 100)
                    }
                    return newLives
                  })
                }
              }
            })

            // Check win condition
            setMaze((currentMaze) => {
              const hasDotsLeft = currentMaze.some((row) => row.some((cell) => cell === 0 || cell === 2))
              if (!hasDotsLeft) {
                setGameWon(true)
                setShowNameModal(true)
              }
              return currentMaze
            })

            return currentPacman
          })
          return currentGhosts
        })
      }, 200)
    } else if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current)
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [isPlaying, gameOver, isPaused, powerMode])

  // Power mode timer
  useEffect(() => {
    if (powerMode && powerModeTimer > 0) {
      powerTimerRef.current = setInterval(() => {
        setPowerModeTimer((prev) => {
          if (prev <= 1) {
            setPowerMode(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (powerTimerRef.current) {
      clearInterval(powerTimerRef.current)
    }

    return () => {
      if (powerTimerRef.current) {
        clearInterval(powerTimerRef.current)
      }
    }
  }, [powerMode, powerModeTimer])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault()
          movePacman("left")
          break
        case "ArrowRight":
          e.preventDefault()
          movePacman("right")
          break
        case "ArrowUp":
          e.preventDefault()
          movePacman("up")
          break
        case "ArrowDown":
          e.preventDefault()
          movePacman("down")
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
  }, [isPlaying, gameOver, movePacman])

  const renderCell = (cell: number, x: number, y: number) => {
    const isPacmanHere = pacman.x === x && pacman.y === y
    const ghost = ghosts.find((g) => g.x === x && g.y === y)

    let content = ""
    let bgColor = "#000"

    if (cell === 1) {
      bgColor = "#0000ff"
    } else if (cell === 0) {
      content = "•"
      bgColor = "#000"
    } else if (cell === 2) {
      content = "●"
      bgColor = "#000"
    }

    if (isPacmanHere) {
      content = "🟡"
    } else if (ghost) {
      content = powerMode ? "👻" : "👾"
    }

    return (
      <div
        key={`${x}-${y}`}
        className="flex items-center justify-center text-xs font-bold"
        style={{
          width: CELL_SIZE,
          height: CELL_SIZE,
          backgroundColor: bgColor,
          color: ghost ? ghost.color : "#ffff00",
          border: cell === 1 ? "1px solid #4444ff" : "none",
        }}
      >
        {content}
      </div>
    )
  }

  if ((gameOver || gameWon) && !showNameModal) {
    return (
      <GameLayout gameTitle="Pac-Man">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Trophy className="w-20 h-20 text-yellow-500" />
              </div>
              <CardTitle className="text-4xl text-white">
                {gameWon ? "¡Felicitaciones!" : "¡Juego Terminado!"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-6xl font-bold text-red-400">{score}</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">{lives}</div>
                  <div className="text-white/80">Vidas</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">{gameWon ? "✅" : "❌"}</div>
                  <div className="text-white/80">Completado</div>
                </div>
              </div>
              <p className="text-2xl text-white/90">
                {gameWon
                  ? "¡Completaste el laberinto! 🎉"
                  : score >= 1000
                    ? "¡Buen puntaje! 👏"
                    : "¡Sigue intentando! 💪"}
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
      <GameLayout gameTitle="Pac-Man">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
            <CardHeader>
              <CardTitle className="text-4xl text-white">🟡 Pac-Man</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-2xl text-white/90">El clásico juego de comecocos</p>
              <div className="text-lg text-white/80 space-y-2">
                <p>🎯 Come todos los puntos para ganar</p>
                <p>⬅️➡️⬆️⬇️ Usa las flechas para moverte</p>
                <p>👾 Evita a los fantasmas</p>
                <p>● Come las píldoras de poder para perseguir fantasmas</p>
                <p>⏸️ Presiona 'P' para pausar</p>
                <p className="text-green-400 font-bold">💰 10 puntos por punto, 50 por píldora, 200 por fantasma</p>
              </div>
              <Button onClick={startGame} size="lg" className={`text-2xl py-8 px-12 bg-${brandingData.color}-600 hover:bg-${brandingData.color}-700`}>
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
    <GameLayout gameTitle="Pac-Man">
      <PlayerNameModal isOpen={showNameModal} onSubmit={handleSaveScore} gameTitle="Pac-Man" />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Board */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="flex justify-center">
                  <div className="bg-black p-2 rounded-lg border-2 border-gray-600">
                    <div
                      className="grid gap-0"
                      style={{ gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${CELL_SIZE}px)` }}
                    >
                      {maze.map((row, y) => row.map((cell, x) => renderCell(cell, x, y)))}
                    </div>
                  </div>
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
                    <div className="text-xl font-bold text-green-400">{lives}</div>
                    <div className="text-white/80 text-sm">Vidas</div>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg text-center">
                    <div className={`text-xl font-bold ${powerMode ? "text-yellow-400" : "text-gray-400"}`}>
                      {powerMode ? powerModeTimer : "OFF"}
                    </div>
                    <div className="text-white/80 text-sm">Power</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-xl text-white text-center">Controles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div></div>
                  <Button
                    onClick={() => movePacman("up")}
                    variant="outline"
                    className="text-white border-white/30 bg-white/10 hover:bg-white/20"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <div></div>
                  <Button
                    onClick={() => movePacman("left")}
                    variant="outline"
                    className="text-white border-white/30 bg-white/10 hover:bg-white/20"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <div></div>
                  <Button
                    onClick={() => movePacman("right")}
                    variant="outline"
                    className="text-white border-white/30 bg-white/10 hover:bg-white/20"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <div></div>
                  <Button
                    onClick={() => movePacman("down")}
                    variant="outline"
                    className="text-white border-white/30 bg-white/10 hover:bg-white/20"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  <div></div>
                </div>
                <Button onClick={togglePause} className="w-full bg-yellow-600 hover:bg-yellow-700">
                  <Pause className="w-4 h-4 mr-2" />
                  {isPaused ? "Reanudar" : "Pausar"}
                </Button>
              </CardContent>
            </Card>

            {/* Legend */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-xl text-white text-center">Leyenda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-white/80">
                <div className="flex items-center justify-between">
                  <span>🟡 Pac-Man</span>
                  <span>Tú</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>👾 Fantasmas</span>
                  <span>Enemigos</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>👻 Fantasmas</span>
                  <span>Modo Power</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• Puntos</span>
                  <span>10 pts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>● Píldora</span>
                  <span>50 pts</span>
                </div>
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
