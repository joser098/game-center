import type React from "react"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"
import brandingData from "@/utils/conts";
import Banner from "@/components/Banner.tsx";
import { colorVariants } from "@/utils/game-config";
import { useEffect, useState } from "react";

interface GameLayoutProps {
  children: React.ReactNode
  gameTitle: string
}

export default function GameLayout({ children, gameTitle }: GameLayoutProps) {
  const brandColors = colorVariants[brandingData.color] || [
  "#ff7676", // coral
  "#fddb3a", // amarillo
  "#1dd3b0", // verde agua
  "#6c63ff", // violeta eléctrico
  ];

  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [showNavButtons, setShowNavButtons] = useState<boolean>(true);

  useEffect(() => {
    const saved = localStorage.getItem("userSettings");
    if (saved) {
      try {
        const settings = JSON.parse(saved);

        // 🧠 Mostrar u ocultar el banner
        if (typeof settings.showBanner === "boolean") {
          setShowBanner(settings.showBanner);
        }

        // 🎮 Verificar cuántos juegos están activos
        const activeGames = Object.values(settings.games || {}).filter((g: boolean) => g);
        if (activeGames.length <= 1) {
          setShowNavButtons(false);
        } else {
          setShowNavButtons(true);
        }
      } catch {
        console.warn("Error leyendo configuración de usuario");
      }
    }
  }, []);
  
  return (
    <div 
    className={`flex flex-col min-h-screen bg-animated bg-gradient-to-br from-${brandingData.color}-900 via-${brandingData.color}-800 to-${brandingData.color}-900`}
    style={{
        "--color-1": brandColors[0],
        "--color-2": brandColors[1],
        "--color-3": brandColors[2],
        "--color-4": brandColors[3],
      } as React.CSSProperties }>
      {/* Game Header */}
      <header className="border-b border-white/20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <img
                src={brandingData.logoUrl || "/placeholder.svg"}
                alt={`${brandingData.companyName} Logo`}
                width={200}
                height={200}
                className="rounded-full border-2 border-white bg-white p-1"
              />
              <div>
                <h1 className=" text-6xl font-bold text-white drop-shadow-md">{gameTitle}</h1>
                <p className="text-4xl text-white/80">{brandingData.companyName}</p>
              </div>
            </div>

            {(showNavButtons && <div className="flex items-center space-x-4">
              <a href="/">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-white text-4xl border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20"
                >
                  <ArrowLeft className="w-10 h-10 mr-2" />
                  Volver a Juegos
                </Button>
              </a>
              {/* <a href="/">
                <Button
                  size="lg"
                  style={{ backgroundColor: brandingData.brandColor }}
                  className="text-white text-4xl font-semibold shadow-lg"
                >
                  <Home className="w-10 h-10 mr-2" />
                  Inicio
                </Button>
              </a> */}
            </div>)}
          </div>
        </div>
      </header>

      {/* Game Content */}
      <main className="container h-full m-auto px-1 py-6">
        {children}
      </main>


      {/* Footer */}
      <footer className="border-t border-white/20 bg-black/20 backdrop-blur-sm mt-auto">
        {/* ADS BANNER */}
        {showBanner && <Banner />}
        <div className="container mx-auto px-6 py-12 text-center">
          <p className="text-white/80 text-3xl">
            Powered by © {" "}
            <span style={{ color: brandingData.brandColor }} className="font-bold">
              Nuevos eventos
            </span>
          </p>
        </div>
      </footer>
    </div>
  )
}
