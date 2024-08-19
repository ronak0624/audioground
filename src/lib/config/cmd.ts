import { appDataDir } from "@tauri-apps/api/path";
import { Command } from "@tauri-apps/api/shell";
import { PYTHON, MAIN, PIP, PYRESOURCE, REQUIREMENTS, VENV } from "./paths";

export const create_virtual_environment = async () => {
  const venv = await VENV();
  const pip = await PIP();
  const requirements = await REQUIREMENTS();
  const resources = await PYRESOURCE();

  const appData = await appDataDir();

  const cmd = [
    // `rsync -a --filter="P ${venv}" "${resources}" "${appData}"`,
    `cp -R "${resources}" "${appData}"`,
    `python3 -m venv "${venv}"`,
    `"${pip}" install -r "${requirements}"`,
  ].join(" && ");

  return new Command("sh", ["-c", cmd], { cwd: await appDataDir() });
};

export const labeler = async (paths: string[]) => {
  const sanitized = paths.map((path) => `'${path.replaceAll("'", "'\\''")}'`);

  const python = await PYTHON();
  const main = await MAIN();

  return new Command("sh", [
    "-c",
    `"${python}" "${main}" --paths ${sanitized.join(" ")} & echo "PID:$!"`,
  ]);
};
