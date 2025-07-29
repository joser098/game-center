import type React from "react"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"
import brandingData from "@/utils/conts";

interface GameLayoutProps {
  children: React.ReactNode
  gameTitle: string
}

export default function GameLayout({ children, gameTitle }: GameLayoutProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900`}>
      {/* Game Header */}
      <header className="border-b border-white/20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={brandingData.logoUrl || "/placeholder.svg"}
                alt={`${brandingData.companyName} Logo`}
                width={60}
                height={60}
                className="rounded-full border-2 border-white bg-white p-1"
              />
              <div>
                <h1 className="text-2xl font-bold text-white drop-shadow-md">{gameTitle}</h1>
                <p className="text-sm text-white/80">{brandingData.companyName}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <a href="/">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-white border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Volver a Juegos
                </Button>
              </a>
              <a href="/">
                <Button
                  size="lg"
                  style={{ backgroundColor: brandingData.brandColor }}
                  className="text-white font-semibold shadow-lg"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Inicio
                </Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Game Content */}
      <main className="container mx-auto px-6 py-8">{children}</main>

      {/* Footer */}
      <footer className="border-t border-white/20 bg-black/20 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-6 py-4 text-center">
          <p className="text-white/80">
            © 2024{" "}
            <span style={{ color: brandingData.brandColor }} className="font-bold">
              {brandingData.companyName}
            </span>{" "}
            - {brandingData.motive}
          </p>
        </div>
      </footer>
    </div>
  )
}
