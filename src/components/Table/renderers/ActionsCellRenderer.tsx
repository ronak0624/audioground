import type { CustomCellRendererProps } from "@ag-grid-community/react";
import { type FunctionComponent, useCallback } from "react";

import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteTrack } from "@lib/store/tracks";

export const ActionsCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ api, node }) => {
  const onRemoveClick = useCallback(() => {
    const rowData = node.data;
    deleteTrack(rowData.path);
    api.applyTransaction({ remove: [rowData] });
  }, [node, api]);

  return (
    <Button
      className="bg-transparent text-destructive hover:bg-destructive/90"
      variant="ghost"
      onClick={onRemoveClick}
    >
      <XIcon className="icon" />
    </Button>
  );
};
