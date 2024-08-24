import { useRef, useState } from "react";
import { Command } from "@tauri-apps/api/shell";
import { AudioLabels } from "@lib/types";
import { setTrack } from "@lib/store/tracks";
import { toast } from "sonner";
import { labeler } from "@lib/config/cmd";

const INIT_STATE: AudioLabels = {
  file_extension: "",
  key: "",
  duration: 0,
  bpm: "",
  genre: "",
  genres: "",
  instrument: "",
  moods: "",
  path: "",
  timestamp: "",
};

export type RunnerStatus =
  | "Initializing"
  | "Downloading"
  | "Running"
  | "Stopped"
  | "Error";

export type TagRunnerResult = {
  start: (
    list: string[],
    onComplete: () => void,
    onStdout: (entry: AudioLabels) => void,
  ) => Promise<void>;
  stop: () => Promise<void>;
  status: RunnerStatus;
  stdout: string[];
  stderr: string;
  progress: number;
  total: number;
  currentEntry: AudioLabels;
};

export default function useTagRunner(): TagRunnerResult {
  const [status, setStatus] = useState<TagRunnerResult["status"]>("Stopped");
  const [stdout, setStdout] = useState<string[]>([]);
  const [stderr, setStderr] = useState<string>("");
  const [PID, setPID] = useState<number | undefined>();
  const [currentEntry, setCurrentEntry] = useState<AudioLabels>(INIT_STATE);

  const progress = useRef(0);
  const total = useRef(0);

  // TODO: Create shell sidecar class
  const start = async (
    list: string[],
    onComplete = () => {},
    onStdout = (_: AudioLabels) => {},
  ) => {
    console.log(list);
    setStatus("Initializing");
    total.current = list.length;
    progress.current = 0.01;

    try {
      const instance = await labeler(list);
      instance.stdout.on("data", (line: string) => {
        if (line.startsWith("PID:")) {
          try {
            const pid = parseInt(line.split(":")[1]);
            setPID(pid);
          } catch (e) {
            console.error(e);
          }
          return;
        }

        if (line.startsWith("<|")) {
          const message = line.slice(2, -3);
          if (message.startsWith("Downloading")) {
            setStatus("Downloading");
          }
          toast.info(message);
          return;
        }

        if (!line || line[0] !== "{") return;

        setStatus("Running");
        setStdout((prev) => [...prev, line]);
        const entry: AudioLabels = JSON.parse(line);
        console.log(entry);
        onStdout(entry);
        progress.current = Math.round(progress.current + 1);
        setTrack(entry.path, entry);
        setCurrentEntry(entry);
      });

      instance.stderr.on("data", (line) => {
        console.debug(line);
        toast.error(line);
        setStderr(line);
      });

      instance.on("close", () => {
        console.log("closed");
        progress.current = 0;

        onComplete();
        setStatus("Stopped");
      });

      instance.on("error", (e) => {
        console.error(e);
        setStatus("Error");
      });

      const child = await instance.spawn();
      console.log(child.pid);
    } catch (e) {
      console.error(e);
      setStatus("Error");
    }
  };

  const stop = async () => {
    if (!PID) return;
    console.log("stopping");
    const { stderr, stdout } = await new Command("kill", [
      "-9",
      `${PID}`,
    ]).execute();

    if (stderr) console.error(stderr);
    if (stdout) console.log(stdout);

    setStatus("Stopped");
    toast.warning(
      `Tagging stopped with ${total.current - progress.current} files left.`,
    );
    progress.current = 0;
  };

  return {
    start,
    stop,
    status,
    stdout,
    stderr,
    progress: progress.current,
    total: total.current,
    currentEntry,
  };
}
