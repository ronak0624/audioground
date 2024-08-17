import { getThumbnail } from "@lib/store/thumbnails";
import { useEffect, useRef } from "react";

// Initializes with the default image, then fetches the album art
// directly from the file metadata. Unmounts and removes the blob
// when the row is removed from the table buffer.
const AlbumArt = (props: { path: string; data: string }) => {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    (async () => {
      if (!ref.current) return;

      const thumb = (await getThumbnail(props.path)) ?? "/thumbdefault.svg";
      ref.current.src = thumb;
    })();
  }, [props.data]);

  return (
    <div className="w-12 h-12 mr-4">
      <img
        ref={ref}
        src={props.data ?? "/thumbdefault.svg"}
        className="rounded-sm w-12 h-12 mr-4"
        alt="album cover"
        onError={(e) => (e.currentTarget.src = "/thumbdefault.svg")}
      />
    </div>
  );
};

export default AlbumArt;
