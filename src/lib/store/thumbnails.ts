import { Store } from "tauri-plugin-store-api";

const thumbnails = new Store(".thumbnail.dat");

type Thumbnail = string;

export async function setThumbnail(key: string, value: Thumbnail) {
  await thumbnails.set(key, value);
}

export async function getThumbnail(key: string) {
  return await thumbnails.get<Thumbnail>(key);
}

export { thumbnails };
