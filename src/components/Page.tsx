import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gamepad2, Users, Trophy, Zap, Crown, Brain, Gift } from "lucide-react"
import brandingData from "@/utils/conts";

const games = [
  {
    id: "trivia",
    name: "Trivia Challenge",
    description: "Pon a prueba tus conocimientos",
    icon: Trophy,
    players: "2-8 jugadores",
    duration: "15-30 min",
  },
  {
    id: "memory",
    name: "Desafío de Memoria",
    description: "Encuentra las parejas y ejercita tu mente",
    icon: Zap,
    players: "1-4 jugadores",
    duration: "10-20 min",
  },
  {
    id: "word-game",
    name: "Maestro de Palabras",
    description: "Adivina palabras y compite con amigos",
    icon: Users,
    players: "2-6 jugadores",
    duration: "20-40 min",
  },
  {
    id: "reaction-time",
    name: "Tiempo de Reacción",
    description: "¡Compete con tus amigos y gana recompensas!",
    icon: Trophy,
    players: "2-6 jugadores",
    duration: "15-30 min",
  },
  {
    id: "simon-says",
    name: "Simón Dice",
    description: "Memoriza y repite la secuencia de colores que Simón te muestre",
    icon: Brain,
    players: "2-6 jugadores",
    duration: "20-40 min",
  },
  {
    id: "pacman",
    name: "Pac-Man",
    description: "El clásico juego de comecocos",
    icon: Brain,
    players: "2-6 jugadores",
    duration: "20-40 min",
  },
  {
    id: "tetris",
    name: "Tetris",
    description: "Juega contra el tiempo y gana puntos",
    icon: Brain,
    players: "2-6 jugadores",
    duration: "20-40 min",
  },
  {
    id: "gift-wheel",
    name: "Rueda de Regalos",
    description: "¡Gana premios y gana puntos!",
    icon: Gift,
    players: "2-6 jugadores",
    duration: "20-40 min"
  }
]

export default function HomePage() {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-${brandingData.color}-900 via-${brandingData.color}-800 to-${brandingData.color}-900`}>
      {/* Header with Branding */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundColor: brandingData.brandColor }} />
        <div className="relative container mx-auto px-8 pt-12 pb-6">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <img
                src={brandingData.logoUrl}
                alt={`${brandingData.companyName} Logo`}
                width={250}
                height={220}
                className="rounded-full border-4 border-white shadow-2xl bg-white p-2"
              />
              <div
                className="absolute -inset-2 rounded-full opacity-20"
                style={{ backgroundColor: brandingData.brandColor }}
              />
            </div>

            <div className="space-y-4">
              {/* <h1 className="text-6xl font-bold text-white tracking-tight drop-shadow-lg">
                {brandingData.companyName}
              </h1> */}
              <p className={`text-4xl font-bold text-white bg-${brandingData.color}-600 px-6 py-6 rounded-full border-2 border-white shadow-lg`}>
                {brandingData.motive}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Leaderboard Button */}
      <div className="container mx-auto px-8 py-8">
        <div className="text-center">
          <a href="/leaderboard">
            <Button
              size="lg"
              className="cursor-pointer text-5xl py-6 px-12 bg-yellow-600 hover:bg-yellow-700 text-white font-bold shadow-2xl border-2 border-yellow-400"
            >
              <Crown className="w-8 h-8 mr-3" />Tabla de Puntuaciones
            </Button>
          </a>
        </div>
      </div>

      {/* Games Section */}
      <main className="container mx-auto px-8 py-4">
        <div className="text-center pt-4 pb-8">
          <h2 className="text-5xl font-bold text-white drop-shadow-lg">¡Selecciona un juego y comienza la diversión!</h2>
          {/* <p className="text-xl text-white/90">¡Selecciona un juego y comienza la diversión!</p> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto">
          {games.map((game) => {
            const IconComponent = game.icon
            return (
              <Card
                key={game.id}
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                <CardHeader className="text-center pb-1">
                  <div className="flex justify-center mb-4">
                    <div
                      className="p-6 rounded-full shadow-lg"
                      style={{ backgroundColor: `${brandingData.brandColor}40` }}
                    >
                      <IconComponent className="w-12 h-12" style={{ color: '#fff' }} />
                    </div>
                  </div>
                  <CardTitle className="text-5xl text-white drop-shadow-md">{game.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <p className="text-3xl text-white/90">{game.description}</p>
                  {/* <div className="flex justify-evenly space-y-8 text-white/80">
                    <p className="text-3xl">👥 {game.players}</p>
                    <p className="text-3xl">⏱️ {game.duration}</p>
                  </div> */}
                  <a href={`/games/${game.id}`}>
                    <Button
                      size="lg"
                      className="w-full text-5xl py-6 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white/20"
                      style={{ backgroundColor: brandingData.brandColor }}
                    >
                      <Gamepad2 className="w-6 h-6 mr-3" />
                      ¡Jugar Ahora!
                    </Button>
                  </a>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* PROMOCIONAL MARCA SOLO HOME */}
        {/* <div className="text-center mt-20 pt-12 border-t border-white/20">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-4xl font-bold text-white mb-4">🥤 Momentos Refrescantes</h3>
            <p className="text-2xl text-white/90">
              Disfruta de estos juegos mientras compartes momentos únicos con tu equipo
            </p>
          </div>
        </div> */}
      </main>
    </div>
  )
}