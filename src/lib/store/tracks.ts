import { Store } from "tauri-plugin-store-api";
import { dialog } from "@tauri-apps/api";
import { Track } from "@lib/types";

import { documentDir, join } from "@tauri-apps/api/path";
import { fs } from "@tauri-apps/api";

import _ from "lodash";
import { deleteAllThumbnails, deleteThumbnail } from "./thumbnails";

// TODO: Don't use raw filepath as hash

const trackStore = new Store(".tracks.dat");

/**
 *
 * @param key Path to track as key. Note that if a track has moved, it will be considered a new file by the tagger.
 * @param value Track to set. If editing an exisitng key, only the keys you provide will be overwritten
 */
export async function setTrack(key: string, value: Track, merge = true) {
  const prev = await getTrack(key);
  await trackStore.set(
    key,
    merge ? _.merge(prev, value) : { ...prev, ...value },
  );
  await trackStore.save();
}

export async function getTrack(key: string) {
  return await trackStore.get<Track>(key);
}

export async function isTrack(key: string) {
  return !!(await trackStore.get<Track>(key));
}

export async function getAllTracks() {
  return await trackStore.entries<Track>();
}

/**
 *
 * @returns {Promise<[string, Track][]>} Array of [key, Track] pairs that have not been tagged by some model
 */
export async function getUntaggedTracks() {
  const tracks = await getAllTracks();

  return _.filter(tracks, ([, value]) => !value.instrument);
}

/**
 *
 * @returns {Promise<[string, Track][]>} Array of [key, Track] pairs that have been tagged by some model
 */
export async function getTaggedTracks() {
  const tracks = await getAllTracks();

  return _.filter(tracks, ([, value]) => !!value.instrument);
}

/**
 *
 * @returns {boolean} True if user confirms deletion
 */
export async function deleteAllTracks() {
  const checkWithUser = await dialog.confirm(
    "Are you sure you want to clear your library?",
  );
  if (checkWithUser) {
    await trackStore.clear();
    await deleteAllThumbnails();
    await trackStore.save();
  }
  return checkWithUser;
}

export async function deleteTrack(key: string) {
  await trackStore.delete(key);
  await deleteThumbnail(key);
  await trackStore.save();
}

// Export the store to json
export async function exportDataset() {
  const tracks = _.filter(
    await trackStore.values<Track>(),
    (track) => !!track.instrument,
  );
  const json = JSON.stringify(tracks, null, 2);
  const output = await dialog.save({
    defaultPath: await join(await documentDir(), "audiogroundtags.json"),
    filters: [{ name: "JSON", extensions: ["json"] }],
  });
  if (output) {
    await fs.writeTextFile(output, json);
  }
}

export { trackStore };
