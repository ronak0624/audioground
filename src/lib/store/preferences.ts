import { Store } from "tauri-plugin-store-api";

const preferences = new Store(".preferences.dat");

type Preference = string | number | string[] | number[];

export async function setPreference(key: string, value: Preference) {
  await preferences.set(key, value);
}

export async function getPreference(key: string) {
  return await preferences.get<{ value: Preference }>(key);
}

export { preferences };
