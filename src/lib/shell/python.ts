import { useState } from "react";
import { ChildProcess, Command } from "@tauri-apps/api/shell";
import useOnMount from "../hooks/useOnMount";
import { ROOT } from "@lib/config/paths";

import { create_virtual_environment } from "@lib/config/cmd";

import { appDataDir } from "@tauri-apps/api/path";

const shell = async (cmd: string): Promise<ChildProcess> => {
  console.log(await ROOT());
  const proc = await new Command("sh", ["-c", cmd], {
    cwd: await appDataDir(),
  }).execute();
  console.log(proc.stdout);
  if (proc.code !== 0) {
    console.error(proc.stderr);
    throw new Error(proc.stderr);
  }
  return proc;
};

async function createVenv() {
  const cmd = await create_virtual_environment();

  await shell(cmd);
}

export default function usePythonVenv() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const loading = !done && !error;

  useOnMount(() => {
    if (sessionStorage.getItem("venv")) {
      setDone(true);
      return;
    }
    createVenv()
      .then(() => {
        console.log("dependencies installed");
        setDone(true);
        sessionStorage.setItem("venv", "true");
      })
      .catch((e) => {
        sessionStorage.removeItem("venv");
        setError(e);
      });
  });
  return [done, loading, error];
}
