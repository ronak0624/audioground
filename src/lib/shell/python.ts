import { useState } from "react";
import useOnMount from "../hooks/useOnMount";

import { create_virtual_environment } from "@lib/config/cmd";

async function createVenv() {
  const cmd = await create_virtual_environment();

  const { stdout, stderr } = await cmd.execute();
  if (stdout) console.log(stdout);
  if (stderr) throw new Error(stderr);
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
