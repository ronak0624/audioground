import { setThumbnail } from "@lib/store/thumbnails";
import { AlbumArtRust } from "@lib/types";
import { invoke } from "@tauri-apps/api";

export default async function makeThumbnail(
  path: string,
  canvas: HTMLCanvasElement,
  size = 48,
) {
  const { data, mime_type } = await invoke<AlbumArtRust>("get_album_art", {
    path,
  });

  const img = new Image();
  if (!data || !img) return;

  img.onload = async () => {
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(img, 0, 0, size, size);
      const dataUrl = canvas.toDataURL("image/png");
      await setThumbnail(path, dataUrl);
    }
  };

  const blob = new Blob([new Uint8Array(data)], {
    type: mime_type,
  });

  if (blob.size < 50) {
    img.src = "/thumbdefault.svg";
    return;
  }

  img.src = URL.createObjectURL(blob);
}
