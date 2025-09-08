import React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import GameLayout from "@/components/game-layout"
import { Trophy, Medal, Award, Crown, Home, RotateCcw, Gamepad2, Clock, Target } from "lucide-react"
import {
  getTopPlayers,
  getGameLeaderboard,
  clearLeaderboard,
  type LeaderboardEntry,
  type PlayerScore,
} from "@/lib/leaderboard"

const gameIcons: { [key: string]: any } = {
  trivia: Trophy,
  memory: Award,
  "word-game": Target,
  "simon-says": Target,
  // "number-guess": Medal,
  "reaction-time": Clock,
  // "rock-paper-scissors": Gamepad2,
}

const gameNames: { [key: string]: string } = {
  trivia: "Trivia Challenge",
  memory: "Desafío de Memoria",
  "word-game": "Maestro de Palabras",
  "simon-says": "Simón Dice",
  // "number-guess": "Adivina el Número",
  "reaction-time": "Tiempo de Reacción",
  // "rock-paper-scissors": "Piedra, Papel o Tijera",
}

export default function LeaderboardPage() {
  const [topPlayers, setTopPlayers] = useState<LeaderboardEntry[]>([])
  const [selectedGame, setSelectedGame] = useState<string>("all")
  const [gameScores, setGameScores] = useState<PlayerScore[]>([])

  useEffect(() => {
    setTopPlayers(getTopPlayers(20))
  }, [])

  useEffect(() => {
    if (selectedGame !== "all") {
      setGameScores(getGameLeaderboard(selectedGame, 15))
    }
  }, [selectedGame])

  const handleClearLeaderboard = () => {
    if (confirm("¿Estás seguro de que quieres borrar todas las puntuaciones?")) {
      clearLeaderboard()
      setTopPlayers([])
      setGameScores([])
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-white/70 font-bold">{position}</span>
    }
  }

  return (
    <GameLayout gameTitle="Tabla de Puntuaciones">
      <main className="container mx-auto px-8 py-12">
        {/* Game Filter */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-white text-center">Filtrar por Juego</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                onClick={() => setSelectedGame("all")}
                variant={selectedGame === "all" ? "default" : "outline"}
                className={
                  selectedGame === "all"
                    ? "bg-red-600 hover:bg-red-700"
                    : "text-white border-white/30 bg-white/10 hover:bg-white/20"
                }
              >
                <Trophy className="w-4 h-4 mr-2" />
                Todos los Juegos
              </Button>
              {Object.entries(gameNames).map(([gameId, gameName]) => {
                const IconComponent = gameIcons[gameId] || Gamepad2
                return (
                  <Button
                    key={gameId}
                    onClick={() => setSelectedGame(gameId)}
                    variant={selectedGame === gameId ? "default" : "outline"}
                    className={
                      selectedGame === gameId
                        ? "bg-red-600 hover:bg-red-700"
                        : "text-white border-white/30 bg-white/10 hover:bg-white/20"
                    }
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {gameName}
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Global Leaderboard */}
          {selectedGame === "all" && (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-3xl text-white text-center flex items-center justify-center">
                  <Crown className="w-8 h-8 mr-3 text-yellow-500" />
                  Top Jugadores Globales
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topPlayers.length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <p className="text-xl text-white/70">¡Aún no hay puntuaciones!</p>
                    <p className="text-white/50">Juega algunos juegos para aparecer aquí</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {topPlayers.map((player, index) => (
                      <div
                        key={player.playerName}
                        className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
                          index < 3
                            ? "bg-gradient-to-r from-yellow-500/20 to-red-500/20 border border-yellow-500/30"
                            : "bg-white/5"
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          {getRankIcon(index + 1)}
                          <div>
                            <div className="text-lg font-bold text-white">{player.playerName}</div>
                            <div className="text-sm text-white/70">
                              {player.gamesPlayed} juegos • Última vez: {formatDate(player.lastPlayed)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-red-400">{player.totalScore}</div>
                          <div className="text-sm text-white/70">puntos totales</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Game-specific Leaderboard */}
          {selectedGame !== "all" && (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-3xl text-white text-center flex items-center justify-center">
                  {React.createElement(gameIcons[selectedGame] || Gamepad2, { className: "w-8 h-8 mr-3 text-red-400" })}
                  {gameNames[selectedGame]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {gameScores.length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <p className="text-xl text-white/70">¡Aún no hay puntuaciones para este juego!</p>
                    <a href={`/games/${selectedGame}`}>
                      <Button className="mt-4 bg-red-600 hover:bg-red-700">
                        <Gamepad2 className="w-4 h-4 mr-2" />
                        Jugar Ahora
                      </Button>
                    </a>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {gameScores.map((score, index) => (
                      <div
                        key={score.id}
                        className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
                          index < 3
                            ? "bg-gradient-to-r from-yellow-500/20 to-red-500/20 border border-yellow-500/30"
                            : "bg-white/5"
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          {getRankIcon(index + 1)}
                          <div>
                            <div className="text-lg font-bold text-white">{score.playerName}</div>
                            <div className="text-sm text-white/70">
                              {score.details} • {formatDate(score.timestamp)}
                            </div>
                            {score.difficulty && (
                              <Badge variant="outline" className="text-xs mt-1 border-white/30 text-white/80">
                                {score.difficulty}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-red-400">{score.score}</div>
                          <div className="text-sm text-white/70">puntos</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Statistics */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-2xl text-white text-center">📊 Estadísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-blue-400">{topPlayers.length}</div>
                    <div className="text-white/80">Jugadores Totales</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-green-400">
                      {topPlayers.reduce((sum, player) => sum + player.gamesPlayed, 0)}
                    </div>
                    <div className="text-white/80">Partidas Jugadas</div>
                  </div>
                </div>

                {topPlayers.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-lg font-bold text-white">🏆 Jugador Más Activo</h4>
                    <div className="bg-white/10 p-4 rounded-lg">
                      <div className="text-lg font-bold text-yellow-400">
                        {
                          topPlayers.reduce((most, player) => (player.gamesPlayed > most.gamesPlayed ? player : most))
                            .playerName
                        }
                      </div>
                      <div className="text-white/80">
                        {
                          topPlayers.reduce((most, player) => (player.gamesPlayed > most.gamesPlayed ? player : most))
                            .gamesPlayed
                        }{" "}
                        partidas jugadas
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-white/20">
                  <Button
                    onClick={handleClearLeaderboard}
                    variant="outline"
                    className="w-full text-red-400 border-red-400/30 bg-red-400/10 hover:bg-red-400/20"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Limpiar Leaderboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </GameLayout>
  )
}
