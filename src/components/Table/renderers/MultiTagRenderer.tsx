import { FunctionComponent } from "react";
import type { CustomCellRendererProps } from "ag-grid-react";
import { Badge } from "@/components/ui/badge";

const MultiTagRenderer: FunctionComponent<Partial<CustomCellRendererProps>> = ({
  value,
}) => {
  if (typeof value !== "object" || !value)
    return (
      <Badge variant="secondary" className="text-muted-foreground">
        N/A
      </Badge>
    );

  return (
    <div className="flex h-full items-center gap-1 w-full">
      {value?.map((v: string, i: number) => (
        <Badge variant="outline" className="px-2" key={`${value[0]}-${v}-${i}`}>
          {v}
        </Badge>
      ))}
    </div>
  );
};

export default MultiTagRenderer;
