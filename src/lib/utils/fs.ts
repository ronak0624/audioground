import { invoke } from "@tauri-apps/api";
import { ProbeResult } from "@lib/types";

import { trackStore } from "@lib/store/tracks";
import { parseBuffer } from "music-metadata";
import { convertFileSrc } from "@tauri-apps/api/tauri";

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
  const probePromise = list.map(async (f) => {
    const ffprobeRes = await probe(f);
    const entry = { ...ffprobeRes, path: f };
    await trackStore.set(f, entry);

    onProgress(entry);
  });

  await Promise.all(probePromise);
}

export function getBasename(url: string): string {
  const normalizedPath = url.replace(/\\/g, "/");
  const segments = normalizedPath.split("/");
  return segments.pop() || "";
}

export async function getMetadataWithClient(path: string) {
  // Create Uint8Array Buffer from the file
  const buffer = await (await fetch(convertFileSrc(path))).arrayBuffer();
  const stream = new Uint8Array(buffer);

  try {
    const metadata = await parseBuffer(stream);
    return metadata;
  } catch (error) {
    console.error(error);
  }
}
