import type { CustomCellRendererProps } from "@ag-grid-community/react";
import { type FunctionComponent } from "react";
import AlbumArt from "./AlbumArt";

export const TitleCellRenderer: FunctionComponent<CustomCellRendererProps> = ({
  value,
  data: { album, path },
}) => {
  return (
    <div className="h-full flex flex-row items-center justify-center">
      <AlbumArt path={path} />
      <div>
        <div className="text-sm og-link">{value}</div>
        {album ? (
          <div className="text-xs text-gray-500 hover:underline">{album}</div>
        ) : (
          <div className="text-xs text-transparent">‎</div>
        )}
      </div>
    </div>
  );
};

export const SingleRowCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ value }) => (
  <div className="h-full flex flex-row items-center justify-center">
    <div>
      <div className="text-sm og-link">{value}</div>
      <div className="text-xs text-transparent">{value}</div>
    </div>
  </div>
);
