import { invoke } from "@tauri-apps/api";
import { ProbeResult } from "@lib/types";

import { trackStore } from "@lib/store/tracks";
import makeThumbnail from "./thumbnail";
import { thumbnails } from "@lib/store/thumbnails";

import { filter } from "lodash";

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

export const chooseFolders = async (selected: string | string[]) => {
  let directoriesToSearch = [];

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
  return filter(files, (f) => !f.startsWith("."));
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
  const resizer = document.createElement("canvas");
  const probePromise = list.map(async (f) => {
    const ffprobeRes = await probe(f);
    const entry = { ...ffprobeRes, path: f };
    await trackStore.set(f, entry);
    await makeThumbnail(f, resizer);

    onProgress(entry);
  });

  await Promise.all(probePromise);
  await trackStore.save();
  await thumbnails.save();
}

export function getBasename(url: string): string {
  const normalizedPath = url.replace(/\\/g, "/");
  const segments = normalizedPath.split("/");
  return segments.pop() || "";
}
