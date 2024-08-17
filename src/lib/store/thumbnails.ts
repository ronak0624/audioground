import { Store } from "tauri-plugin-store-api";

const thumbnails = new Store(".thumbnail.dat");

type Thumbnail = string;

export async function setThumbnail(key: string, value: Thumbnail) {
  await thumbnails.set(key, value);
}

export async function getThumbnail(key: string) {
  return await thumbnails.get<Thumbnail>(key);
}

export async function getAllThumbnails() {
  return await thumbnails.entries<Thumbnail>();
}

export async function deleteThumbnail(key: string) {
  await thumbnails.delete(key);
}

export async function deleteAllThumbnails() {
  await thumbnails.clear();
  await thumbnails.save();
}

export { thumbnails };
