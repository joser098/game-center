import * as Dialog from "@radix-ui/react-dialog";
import * as Switch from "@radix-ui/react-switch";
import { useEffect, useState } from "react";
import { games } from "@/utils/game-config";

export interface GameItem {
  id: string;
  name: string;
  description: string;
  players: string;
  duration: string;
}

export interface GameConfig {
  [gameId: string]: boolean;
}

export interface UserSettings {
  games: GameConfig;
  expiresAt?: string;
  durationDays?: number;
  durationHours?: number;
  showBanner?: boolean;
}

export default function ConfigModal() {
  const [open, setOpen] = useState<boolean>(false);
  const [gameConfig, setGameConfig] = useState<GameConfig>({});
  const [durationDays, setDurationDays] = useState<number>(1);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [durationHours, setDurationHours] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem("userSettings");
    let expired = false;
    let initialGames: GameConfig = {};

    // 🧱 Inicializar TODOS los juegos en true
    games.forEach((g) => (initialGames[g.id] = true));

    if (saved) {
      try {
        const settings: UserSettings = JSON.parse(saved);

        // Verificar expiración
        if (settings.expiresAt) {
          const now = new Date();
          const expiresAt = new Date(settings.expiresAt);
          if (now > expiresAt) expired = true;
        }

        if (!expired) {
          // 🧩 Aplicar los valores guardados
          setGameConfig({ ...initialGames, ...settings.games });
          setDurationDays(settings.durationDays ?? 1);
          setDurationHours(settings.durationHours ?? 0);
          setShowBanner(settings.showBanner ?? false);
          return; // ✅ listo, no abrir modal
        }
      } catch {
        expired = true;
      }
    }

    // Si está expirado o no hay configuración previa
    setGameConfig(initialGames);
    localStorage.removeItem("appConfigured");
    setOpen(true);
  }, []);

  const toggleGame = (id: string) => {
    setGameConfig((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSave = () => {
    // 🧮 calcular la fecha de expiración
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);
    expiresAt.setHours(expiresAt.getHours() + durationHours);

    const settings: UserSettings = {
      games: gameConfig,
      expiresAt: expiresAt.toISOString(),
      durationDays,
      durationHours,
      showBanner,
    };

    localStorage.setItem("userSettings", JSON.stringify(settings));
    localStorage.setItem("appConfigured", "true");
    setOpen(false);

    // 🔍 Verificar cuántos juegos están habilitados
    const enabledGames = Object.keys(gameConfig).filter(
      (key) => gameConfig[key] === true
    );

    // 🎯 Si hay exactamente 1 juego, ir directamente a ese
    if (enabledGames.length === 1) {
      const target = enabledGames[0];
      window.location.href = `/games/${target}`;
    } else {
      // Si hay varios o ninguno, recargar el home normalmente
      window.location.reload();
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                     w-[85vw] max-w-[1100px] rounded-3xl bg-white p-10 shadow-2xl 
                     text-gray-800 overflow-y-auto max-h-[90vh]"
        >
          <Dialog.Title className="text-4xl font-bold text-center mb-8">
            Configuración inicial ⚙️
          </Dialog.Title>

          {/* 🕒 Duración */}
          <div className="mt-10">
            <h3 className="text-3xl font-semibold mb-4 text-center">
              Duración de la configuración
            </h3>
            <div className="flex justify-center gap-8 text-2xl">
              <div className="flex flex-col items-center">
                <label>Días</label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={durationDays}
                  onChange={(e) =>
                    setDurationDays(Number(e.target.value))
                  }
                  className="border border-gray-300 rounded-xl px-4 py-2 w-28 text-center"
                />
              </div>

              <div className="flex flex-col items-center">
                <label>Horas</label>
                <input
                  type="number"
                  min={0}
                  max={23}
                  value={durationHours}
                  onChange={(e) =>
                    setDurationHours(Number(e.target.value))
                  }
                  className="border border-gray-300 rounded-xl px-4 py-2 w-28 text-center"
                />
              </div>
            </div>
          </div>
          <div className="mt-10">
            <h3 className="text-3xl font-semibold mb-4 text-center">
              ¿Quieres mostrar un banner de video?
            </h3>
            <div className="flex justify-center gap-8 text-2xl">
              <Switch.Root
                checked={showBanner}
                onCheckedChange={() => setShowBanner(!showBanner)}
                className="w-20 h-10 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-600 transition-colors"
              >
                <Switch.Thumb className="block w-9 h-9 bg-white rounded-full shadow absolute left-0.5 top-0.5 transition-transform data-[state=checked]:translate-x-10" />
              </Switch.Root>
            </div>
          </div>

          {/* Juegos */}
          <div className="mt-12">
            <h3 className="text-3xl font-semibold mb-6 text-center">
              Juegos disponibles
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {games.map((game) => {
                const Icon = game.icon;
                const isEnabled = gameConfig[game.id] ?? true;
                return (
                  <div
                    key={game.id}
                    className="flex items-center justify-between border rounded-2xl p-5 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-4 rounded-full">
                        <Icon className="w-10 h-10 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-2xl">{game.name}</h4>
                        <p className="text-gray-500 text-lg">
                          {game.description}
                        </p>
                      </div>
                    </div>

                    <Switch.Root
                      checked={isEnabled}
                      onCheckedChange={() => toggleGame(game.id)}
                      className="w-20 h-10 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-600 transition-colors"
                    >
                      <Switch.Thumb className="block w-9 h-9 bg-white rounded-full shadow absolute left-0.5 top-0.5 transition-transform data-[state=checked]:translate-x-10" />
                    </Switch.Root>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center mt-10">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-12 py-5 text-3xl rounded-2xl hover:bg-blue-700 transition"
            >
              Guardar
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
