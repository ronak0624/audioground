import { FunctionComponent } from "react";
import type { CustomCellRendererProps } from "ag-grid-react";

const Badge = ({ children, style, color }: any) => (
  <span
    className="text-xs px-2 py-1 rounded-full"
    style={{
      backgroundColor: color,
      color: "#fff",
      ...style,
    }}
  >
    {children}
  </span>
);

const MultiTagRenderer: FunctionComponent<CustomCellRendererProps> = ({
  value,
}) => {
  if (typeof value !== "object" || !value)
    return (
      <Badge variant="soft" intent="info">
        N/A
      </Badge>
    );

  return (
    <div className="flex h-full items-center gap-2 w-full overflow-x-auto">
      {value?.map((v: string, i: number) => (
        <Badge
          style={{
            backgroundColor: "var(--accent)",
            color: "#fff",
          }}
          color="#111"
          key={`${value[0]}-${v}-${i}`}
        >
          {v}
        </Badge>
      ))}
    </div>
  );
};

export default MultiTagRenderer;
