import { useAudio } from "@lib/providers/AudioProvider";
import { Pause, Play } from "lucide-react";
import { Button } from "./ui/button";
import { PersonIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

const formatMMSS = (seconds: number) => {
  const fortmatted = new Date(1000 * seconds).toISOString().slice(14, 19);
  return fortmatted[0] === "0" ? fortmatted.slice(1) : fortmatted;
};

const AudioPlayer = () => {
  const { play, pause, ref, isPlaying, current, wavesurfer, duration } =
    useAudio();
  const [currentTime, setCurrentTime] = useState(0);

  const isHidden = !current ? "hidden" : "";

  useEffect(() => {
    let interval = setInterval(() => {
      setCurrentTime(wavesurfer?.getCurrentTime() ?? 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div
      className={twMerge(
        "w-full px-5 flex items-center bg-transparent rounded-b-xl",
        isHidden,
      )}
    >
      {!isPlaying ? (
        <Button
          className="px-2 py-1 rounded-xl shadow-md"
          onClick={() => play()}
        >
          <Play className="icon" />
        </Button>
      ) : (
        <Button className="px-2 py-1 rounded-xl shadow-md" onClick={pause}>
          <Pause className="icon" />
        </Button>
      )}
      <div className="flex-1 flex flex-col justify-center h-full ml-5 py-4">
        <div className="h-12" ref={ref} />
        {current && (
          <div className="flex items-center gap-2 w-full">
            <p className="font-light text-sm text-accent-foreground">
              {current.title}
            </p>
            <div className="flex flex-row font-light text-sm text-muted-foreground items-center gap-1">
              <PersonIcon />
              <span>{current.tags?.artist}</span>
            </div>
            <p className="font-light text-sm text-accent-foreground">
              {formatMMSS(currentTime)}
            </p>
            <p className="font-light text-sm ml-auto text-accent-foreground">
              {formatMMSS(duration ?? 0)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default AudioPlayer;
