import type { CustomCellRendererProps } from "@ag-grid-community/react";
import { type FunctionComponent } from "react";

export const TitleCellRenderer: FunctionComponent<CustomCellRendererProps> = ({
  value,
  data: { image, album },
}) => (
  <div className="h-full flex flex-row items-center justify-center">
    <div className="w-12 h-12 mr-4">
      <img
        src={`/example/inventory/${image}.png`}
        alt={image}
        onError={(e) => (e.currentTarget.src = "/thumbdefault.svg")}
      />
    </div>
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
