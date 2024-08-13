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
  instrument: "",
  moods: "",
  path: "",
  timestamp: "",
};

type TagRunnerProps = {
  start: (list: string[], onComplete: () => void) => Promise<void>;
  stop: () => Promise<void>;
  status: "running" | "stopped" | "error";
  stdout: string[];
  stderr: string;
  progress: number;
  currentEntry?: AudioLabels;
};

const tagger = async (paths: string[]) => {
  const sanitized = paths.map((path) => `"${path.replaceAll('"', '\\"')}"`);
  const root = await join(await resourceDir(), "python");
  const PYTHON = await join(root, ".venv/bin/python");
  const MAIN = await join(root, "main.py");

  return new Command(
    "sh",
    ["-c", `${PYTHON} ${MAIN} --paths ${sanitized.join(" ")}`],
    { cwd: root },
  );
};

export default function useTagRunner(): TagRunnerProps {
  const [status, setStatus] = useState<TagRunnerProps["status"]>("stopped");
  const [stdout, setStdout] = useState<string[]>([]);
  const [stderr, setStderr] = useState<string>("");
  const [taggerChild, setTaggerChild] = useState<Child | undefined>();
  const [currentEntry, setCurrentEntry] = useState<AudioLabels>(INIT_STATE);

  const progress = useRef(0);
  const total = useRef(0);

  const start = async (list: string[], onComplete = () => {}) => {
    console.log(list);
    setStatus("running");
    total.current = list.length;
    progress.current = 0.01 / total.current;

    try {
      const instance = await tagger(list);
      instance.stdout.on("data", (line: string) => {
        if (!line || line[0] !== "{") return;
        setStdout((prev) => [...prev, line]);
        const entry: AudioLabels = JSON.parse(line);
        console.log(entry);
        progress.current = progress.current + 1 / total.current;
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
        toast.success(`Done tagging ${total.current} files.`);
        onComplete();
        setStatus("stopped");
      });
      instance.on("error", (e) => {
        console.error(e);
        setStatus("error");
      });
      const child = await instance.spawn();
      console.log(child.pid);
      setTaggerChild(child);
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };

  const stop = async () => {
    console.log("stopping");
    await taggerChild?.kill();
    setStatus("stopped");
    progress.current = 0;
  };

  return {
    start,
    stop,
    status,
    stdout,
    stderr,
    progress: progress.current,
    currentEntry,
  };
}
