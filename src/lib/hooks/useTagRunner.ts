import { useState } from "react";
import { Child, Command } from "@tauri-apps/api/shell";
import { join, resourceDir } from "@tauri-apps/api/path";

type TagRunnerProps = {
  start: (list: string[]) => Promise<void>;
  stop: () => Promise<void>;
  status: "running" | "stopped" | "error";
  stdout: string[];
  stderr: string;
  progress: number;
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
  const [progress, setProgress] = useState(0);
  const [stdout, setStdout] = useState<string[]>([]);
  const [stderr, setStderr] = useState<string>("");
  const [taggerChild, setTaggerChild] = useState<Child | undefined>();

  const start = async (list: string[]) => {
    console.log(list);
    setStatus("running");
    setProgress(0);
    try {
      const instance = await tagger(list);
      instance.stdout.on("data", (line) => {
        console.log(line);
        setStdout((prev) => [...prev, line]);
      });
      instance.stderr.on("data", (line) => {
        console.error(line);
        setStderr(line);
      });
      instance.on("close", () => {
        console.log("closed");
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
    setStatus("stopped");
    taggerChild?.kill();
  };

  return { start, stop, status, stdout, stderr, progress };
}
