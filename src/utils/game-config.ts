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
    red: ["#ff004c", "#ff3366", "#ff6600", "#ff0000"],
    blue: ["#007bff", "#00aaff", "#0055ff", "#66ccff"],
    green: ["#00ff99", "#00cc66", "#00ffaa", "#00ffcc"],
    yellow: ["#ffff00", "#ffcc00", "#ffaa00", "#fff200"],
    purple: ["#9900ff", "#cc33ff", "#6600ff", "#9933ff"],
  };