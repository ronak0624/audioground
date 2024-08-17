import { useRef, useState } from "react";
import { Child, Command } from "@tauri-apps/api/shell";
import { join, resourceDir } from "@tauri-apps/api/path";
import { AudioLabels } from "@lib/types";
import { setTrack } from "@lib/store/tracks";
import { toast } from "sonner";

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

const tagger = async (paths: string[]) => {
  const sanitized = paths.map((path) => `'${path.replaceAll("'", "'\\''")}'`);

  const root = await join(await resourceDir(), "python");
  const PYTHON = await join(root, ".venv/bin/python");
  const MAIN = await join(root, "main.py");

  return new Command(
    "sh",
    ["-c", `${PYTHON} ${MAIN} --paths ${sanitized.join(" ")}`],
    { cwd: root },
  );
};

export default function useTagRunner(): TagRunnerResult {
  const [status, setStatus] = useState<TagRunnerResult["status"]>("Stopped");
  const [stdout, setStdout] = useState<string[]>([]);
  const [stderr, setStderr] = useState<string>("");
  const [taggerChild, setTaggerChild] = useState<Child | undefined>();
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
      const instance = await tagger(list);
      instance.stdout.on("data", (line: string) => {
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
      setTaggerChild(child);
    } catch (e) {
      console.error(e);
      setStatus("Error");
    }
  };

  const stop = async () => {
    console.log("stopping");
    await taggerChild?.kill();
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
