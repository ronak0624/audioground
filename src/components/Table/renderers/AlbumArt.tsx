import { getMetadataWithClient } from "@lib/utils/fs";
import { selectCover } from "music-metadata";
import { useEffect, useRef } from "react";

// Initializes with the default image, then fetches the album art
// directly from the file metadata. Unmounts and removes the blob
// when the row is removed from the table buffer.
// Initializes with the default image, then fetches the album art
// directly from the file metadata. Unmounts and removes the blob
// when the row is removed from the table buffer.
const AlbumArt = (props: { path: string }) => {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // TODO: Create fast image downsampler
    (async () => {
      const metadata = await getMetadataWithClient(props.path);

      if (!metadata || !ref.current) return;
      const { common } = metadata;
      let content = selectCover(common.picture)?.data;

      if (!content?.buffer) return;
      const blob = new Blob([content.buffer]);
      ref.current.src = URL.createObjectURL(blob);
    })();

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
