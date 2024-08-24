import { TrackRow } from "@/components/Table/rows";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useWavesurfer } from "@wavesurfer/react";
import { createContext, useContext, useRef, useState } from "react";

type AudioProviderHookReturn = {
  play: (track?: TrackRow) => Promise<void>;
  pause: () => void;
  isPlaying: boolean;
  ref: React.RefObject<HTMLDivElement>;
  current?: TrackRow;
  duration?: number;
  wavesurfer?: any;
};

const AudioContext = createContext<AudioProviderHookReturn | null>(null);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};

export const AudioProvider = (props: {
  children: React.ReactNode;
  color?: string;
}) => {
  const containerRef = useRef(null);
  const [track, setTrack] = useState<TrackRow>();

  const { wavesurfer, isPlaying } = useWavesurfer({
    container: containerRef,
    url: "",
    barWidth: 2,
    waveColor: props.color ?? "#2cc8c1",
    height: 36,
  });

  const play = async (track?: TrackRow) => {
    if (!wavesurfer) return;
    try {
      if (track) {
        setTrack(track);
        await wavesurfer.load(convertFileSrc(track.path ?? ""));
      }
      await wavesurfer.play();
    } catch (e) {
      console.error(e);
    }
  };

  const pause = () => {
    if (!wavesurfer) return;
    wavesurfer.pause();
  };

  return (
    <AudioContext.Provider
      value={{
        play,
        pause,
        isPlaying,
        ref: containerRef,
        current: track,
        duration: wavesurfer?.getDuration(),
        wavesurfer,
      }}
    >
      {props.children}
    </AudioContext.Provider>
  );
};
