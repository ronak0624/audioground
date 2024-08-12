import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api";
import { ProbeResult } from "@lib/types";

import { setTrack } from "@lib/store/tracks";

const EXTENSIONS = [
  ".mp3",
  ".wav",
  ".flac",
  ".aac",
  ".ogg",
  ".wma",
  ".m4a",
  ".aiff",
  ".aif",
  ".caf",
  ".alac",
  ".pcm",
];

export async function listDir(path: string) {
  if (!path) return;
  return await invoke<string[]>("ls", {
    dir: path,
    extensions: EXTENSIONS.toString(),
  });
}

export const chooseFolders = async () => {
  const selected = await open({
    directory: true,
    multiple: true,
  });
  let directoriesToSearch = [];

  if (!selected) return;
  if (!Array.isArray(selected)) {
    directoriesToSearch.push(selected);
  } else {
    directoriesToSearch = selected;
  }

  let files: string[] = [];
  for await (let dir of directoriesToSearch) {
    let res = (await listDir(dir)) ?? [];
    files = [...files, ...res];
  }
  return files;
};

export async function probe(path: string): Promise<ProbeResult> {
  if (!path) throw new Error("No path provided");

  const res = await invoke<string>("probe", {
    path,
  });

  return JSON.parse(res);
}

export async function probeFiles(
  list: string[],
  onProgress: (entry: ProbeResult) => void,
) {
  const probePromise = list.map((f) => async () => {
    const ffprobeRes = await probe(f);
    const entry = { ...ffprobeRes, path: f };

    setTrack(f, entry);

    onProgress(entry);
  });

  await Promise.all(probePromise);
}
