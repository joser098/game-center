# Game Center

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Raspberry Pi Commands

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `sudo apt update`         | Update the package list                         |
| `sudo apt upgrade`        | Upgrade all packages                            |
| `sudo apt install <pkg>`  | Install a package                               |
| `sudo apt remove <pkg>`   | Remove a package                                |
| `sudo apt autoremove`     | Remove unneeded packages                        |
| `sudo apt clean`          | Remove unused packages and dependencies         |
| `/home/pi/start-kiosk.sh` | Start kiosk mode from the terminal |
| `killall chromium`        | Kill all chromium processes (Clore Kiosk Mode)  |

### Start Kiosk Mode script (start-kiosk.sh)

```bash
#!/bin/bash

# Navega al proyecto
cd /home/pi/Desktop/game-center

# Ejecuta npm run dev en segundo plano
npm run dev &

# Espera unos segundos a que el servidor arranque
sleep 10

# Abre Chromium en modo kiosko
chromium-browser --kiosk http://localhost:4321
```


