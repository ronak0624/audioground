import { FunctionComponent } from "react";
import type { CustomCellRendererProps } from "ag-grid-react";

const Badge = ({ children }: any) => (
  <span className="text-xs px-2 py-1 rounded-full bg-secondary">
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
        <Badge key={`${value[0]}-${v}-${i}`}>{v}</Badge>
      ))}
    </div>
  );
};

export default MultiTagRenderer;
