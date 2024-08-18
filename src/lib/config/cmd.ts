import { appDataDir } from "@tauri-apps/api/path";
import { Command } from "@tauri-apps/api/shell";
import {
  ROOT,
  PYTHON,
  MAIN,
  PIP,
  PYRESOURCE,
  REQUIREMENTS,
  VENV,
} from "./paths";

export const create_virtual_environment = async () => {
  const venv = await VENV();
  const pip = await PIP();
  const requirements = await REQUIREMENTS();
  const resources = await PYRESOURCE();

  const appData = await appDataDir();

  const rsync = `rsync -a "${resources}" "${appData}"`;
  const venv_cmd = `python3 -m venv "${venv}"`;
  const pip_cmd = `"${pip}" install -r "${requirements}"`;
  return [rsync, venv_cmd, pip_cmd].join(" && ");
};

export const labeler = async (paths: string[]) => {
  const sanitized = paths.map((path) => `'${path.replaceAll("'", "'\\''")}'`);

  const root = await ROOT();
  const python = await PYTHON();
  const main = await MAIN();

  return new Command(
    "sh",
    [
      "-c",
      `"${python}" "${main}" --paths ${sanitized.join(" ")} & echo "PID:$!"`,
    ],
    { cwd: root },
  );
};
