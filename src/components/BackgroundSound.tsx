import { useEffect, useRef } from "react";

interface BackgroundMusicProps {
  src: string;        // ruta del archivo de música (por ejemplo /audio/intro.mp3)
  volume?: number;    // volumen (0 a 1)
  loop?: boolean;     // si se repite o no
  autoPlay?: boolean; // si empieza solo
}

export default function BackgroundMusic({
  src,
  volume = 0.8,
  loop = true,
  autoPlay = true,
}: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.loop = loop;

    if (autoPlay) {
      const tryPlay = async () => {
        try {
          await audio.play();
        } catch (err) {
          console.warn("Reproducción automática bloqueada hasta interacción del usuario:", err);
        }
      };
      tryPlay();
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [src, volume, loop, autoPlay]);

  return <audio ref={audioRef} src={src} />;
}
