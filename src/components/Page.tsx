import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gamepad2, Users, Trophy, Zap } from "lucide-react"
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
]

export default function HomePage() {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-${brandingData.color}-900 via-${brandingData.color}-800 to-${brandingData.color}-900`}>
      {/* Header with Branding */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundColor: brandingData.brandColor }} />
        <div className="relative container mx-auto px-8 py-12">
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
                className="absolute -inset-2 rounded-full opacity-20 animate-pulse"
                style={{ backgroundColor: brandingData.brandColor }}
              />
            </div>

            <div className="space-y-4">
              {/* <h1 className="text-6xl font-bold text-white tracking-tight drop-shadow-lg">
                {brandingData.companyName}
              </h1> */}
              <p className={`text-3xl font-bold text-white bg-${brandingData.color}-600 px-6 py-3 rounded-full border-2 border-white shadow-lg`}>
                {brandingData.motive}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Games Section */}
      <main className="container mx-auto px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">Elige tu Juego</h2>
          <p className="text-2xl text-white/90">¡Selecciona un juego y comienza la diversión!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {games.map((game) => {
            const IconComponent = game.icon
            return (
              <Card
                key={game.id}
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div
                      className="p-6 rounded-full shadow-lg"
                      style={{ backgroundColor: `${brandingData.brandColor}40` }}
                    >
                      <IconComponent className="w-12 h-12" style={{ color: brandingData.brandColor }} />
                    </div>
                  </div>
                  <CardTitle className="text-3xl text-white drop-shadow-md">{game.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <p className="text-xl text-white/90">{game.description}</p>

                  <div className="space-y-2 text-white/80">
                    <p className="text-lg">👥 {game.players}</p>
                    <p className="text-lg">⏱️ {game.duration}</p>
                  </div>

                  <a href={`/games/${game.id}`}>
                    <Button
                      size="lg"
                      className="w-full text-xl py-6 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white/20"
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

        {/* Coca-Cola promotional section */}
        <div className="text-center mt-20 pt-12 border-t border-white/20">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-4xl font-bold text-white mb-4">🥤 Momentos Refrescantes</h3>
            <p className="text-2xl text-white/90">
              Disfruta de estos juegos mientras compartes momentos únicos con tu equipo
            </p>
          </div>
        </div>

        {/* Footer Branding */}
        <div className="text-center mt-20 pt-12 border-t border-white/20">
          <p className="text-2xl text-white/80">
            Powered by{" "}
            <span style={{ color: brandingData.brandColor }} className="font-bold drop-shadow-md">
              {brandingData.companyName}
            </span>
            <span className="font-bold drop-shadow-md">
              {" "} & Nuevos eventos
            </span>
          </p>
        </div>
      </main>
    </div>
  )
}