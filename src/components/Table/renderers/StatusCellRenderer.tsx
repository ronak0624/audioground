import type { CustomCellRendererProps } from "@ag-grid-community/react";
import { type FunctionComponent } from "react";

import { Badge } from "@/components/ui/badge";
import { TrackStatus } from "@/components/Table/cols";
import { Check, BookmarkX, Ellipsis } from "lucide-react";

const colors: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  completed: "outline" as const,
  pending: "default" as const,
  untagged: "secondary" as const,
};
const displayText = {
  completed: <Check size={16} />,
  pending: <Ellipsis className="motion-safe:animate-bounce" size={16} />,
  untagged: <BookmarkX size={16} />,
};

export const StatusCellRenderer: FunctionComponent<CustomCellRendererProps> = ({
  value,
}: {
  value: TrackStatus;
  valueFormatted: string | null | undefined;
}) => (
  <Badge variant={colors[value]} className="flex items-center justify-center">
    {displayText[value]}
  </Badge>
);

// }) => <Badge intent={colors[value]}>{valueFormatted}</Badge>;
