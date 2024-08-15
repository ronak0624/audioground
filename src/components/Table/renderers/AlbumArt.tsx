import { invoke } from "@tauri-apps/api";
import { useEffect, useRef } from "react";

type AlbumArtRust = {
  mime_type: string;
  data: Uint8Array;
};

// Initializes with the default image, then fetches the album art
// directly from the file metadata. Unmounts and removes the blob
// when the row is removed from the table buffer.
const AlbumArt = (props: { path: string }) => {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    invoke<AlbumArtRust>("get_album_art", { path: props.path }).then(
      ({ data, mime_type }) => {
        if (!data || !ref.current) return;

        const blob = new Blob([new Uint8Array(data)], {
          type: mime_type,
        });

        if (blob.size < 50) {
          ref.current.src = "/thumbdefault.svg";
          return;
        }

        ref.current.src = URL.createObjectURL(blob);
      },
    );
    return () => {
      if (!ref.current) return;
      URL.revokeObjectURL(ref.current.src);
    };
  }, []);

  return (
    <div className="w-12 h-12 mr-4">
      <img
        ref={ref}
        src="/thumbdefault.svg"
        className="rounded-sm w-12 h-12 mr-4"
        alt="album cover"
        onError={(e) => (e.currentTarget.src = "/thumbdefault.svg")}
      />
    </div>
  );
};

export default AlbumArt;
