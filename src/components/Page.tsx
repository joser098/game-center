import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gamepad2, Crown } from "lucide-react"
import brandingData from "@/utils/conts"
import { games, colorVariants } from "@/utils/game-config"
import { useStore } from "@nanostores/react"
import { userSettings } from "@/stores/userSettingsStore"

export default function HomePage() {
  const settings = useStore(userSettings)

  // Obtener los juegos permitidos desde la store
  const allowedGames =
    settings && settings.games
      ? Object.keys(settings.games).filter((id) => settings.games[id] === true)
      : games.map((g) => g.id)

  const visibleGames = games.filter((g) => allowedGames.includes(g.id))

  const brandColors = colorVariants[brandingData.color] || [
    "#ff6b6b", // coral brillante
    "#feca57", // amarillo cálido
    "#48dbfb", // celeste suave
    "#1dd1a1", // verde menta
  ]

  return (
    <div
      className="min-h-screen bg-animated"
      style={
        {
          "--color-1": brandColors[0],
          "--color-2": brandColors[1],
          "--color-3": brandColors[2],
          "--color-4": brandColors[3],
        } as React.CSSProperties
      }
    >
      {/* Header with Branding */}
      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundColor: brandingData.brandColor }}
        />
        <div className="relative container mx-auto px-8 pt-12 pb-6">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <img
                src={brandingData.logoUrl}
                alt={`${brandingData.companyName} Logo`}
                width={250}
                height={250}
                className="rounded-full border-4 border-white shadow-2xl bg-white p-2"
              />
              <div
                className="absolute -inset-2 rounded-full opacity-20"
                style={{ backgroundColor: brandingData.brandColor }}
              />
            </div>

            <div className="space-y-4">
              <p
                className={`text-4xl font-bold text-white bg-${brandingData.color}-600 px-6 py-6 rounded-full border-2 border-white shadow-lg`}
              >
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
              <Crown className="w-8 h-8 mr-3" /> Tabla de Puntuaciones
            </Button>
          </a>
        </div>
      </div>

      {/* Games Section */}
      <main className="container mx-auto px-8 py-4">
        <div className="text-center pt-4 pb-8">
          <h2 className="text-5xl font-bold text-white drop-shadow-lg">
            ¡Selecciona un juego y comienza la diversión!
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto">
          {visibleGames.map((game) => {
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
                      <IconComponent
                        className="w-12 h-12"
                        style={{ color: "#fff" }}
                      />
                    </div>
                  </div>
                  <CardTitle className="text-5xl text-white drop-shadow-md">
                    {game.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <p className="text-3xl text-white/90">{game.description}</p>
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

        {/* Si no hay juegos habilitados */}
        {visibleGames.length === 0 && (
          <div className="text-center py-20 text-white text-4xl font-bold opacity-80">
            No hay juegos habilitados 🎮
          </div>
        )}
      </main>
    </div>
  )
}
