import { useState } from "react";
import { ChildProcess, Command } from "@tauri-apps/api/shell";
import useOnMount from "@lib/hooks/useOnMount";
import { resolveResource } from "@tauri-apps/api/path";

const shell = async (cmd: string): Promise<ChildProcess> => {
  const proc = await new Command("sh", ["-c", cmd], {
    cwd: await resolveResource("python"),
  }).execute();

  console.log(proc.stdout);
  if (proc.code !== 0) {
    console.error(proc.stderr);
    throw new Error(proc.stderr);
  }
  return proc;
};

async function createVenv() {
  const PYTHON = await resolveResource("python");

  await shell(
    `python3 -m venv ${PYTHON}/.venv && ${PYTHON}/.venv/bin/pip install -r ${PYTHON}/requirements.txt`,
  );
}

export default function usePythonVenv() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const loading = !done && !error;

  useOnMount(() => {
    createVenv()
      .then(() => {
        console.log("dependencies installed");
        setDone(true);
      })
      .catch((e) => {
        setError(e);
      });
  });
  return [done, loading, error];
}
