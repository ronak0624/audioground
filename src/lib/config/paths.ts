import { appDataDir, join, resolveResource } from "@tauri-apps/api/path";

export const ROOT = async () => await join(await appDataDir(), "python");

export const MAIN = async () => await join(await ROOT(), "main.py");

export const REQUIREMENTS = async () =>
  await join(await ROOT(), "requirements.txt");

export const VENV = async () => await join(await ROOT(), ".venv");

export const PYTHON = async () => await join(await VENV(), "bin", "python");

export const PIP = async () => await join(await VENV(), "bin", "pip");

export const PYRESOURCE = async () => await resolveResource("python");
