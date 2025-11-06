import { Gamepad2, Users, Trophy, Zap, Crown, Brain, Gift } from "lucide-react"

export const games = [
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

export const colorVariants: Record<string, string[]> = {
  rojo: ["#ffb3b3", "#ff6666", "#ff3333", "#e60000", "#b30000"],
  azul: ["#b3d9ff", "#66b3ff", "#3385ff", "#0066ff", "#0047b3"],
  verde: ["#b3ffcc", "#66ff99", "#33cc66", "#00b359", "#008040"],
  amarillo: ["#fff5b3", "#ffeb66", "#ffe033", "#ffd11a", "#e6b800"],
  violeta: ["#e0b3ff", "#cc66ff", "#b333ff", "#9900ff", "#6600cc"],
  naranja: ["#ffd1b3", "#ff9966", "#ff8533", "#ff6600", "#cc5200"],
  rosa: ["#ffcce0", "#ff99cc", "#ff66b2", "#ff3385", "#e60073"],
  cian: ["#b3ffff", "#66ffff", "#33e6e6", "#00cccc", "#009999"],
  turquesa: ["#b3fff0", "#66ffe0", "#33ffcc", "#00e6b8", "#00b38f"],
  gris: ["#f2f2f2", "#cccccc", "#999999", "#666666", "#333333"],
};
