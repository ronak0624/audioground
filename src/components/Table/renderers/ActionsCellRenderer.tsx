import type { CustomCellRendererProps } from "@ag-grid-community/react";
import { type FunctionComponent, useCallback } from "react";

import { Trash } from "lucide-react";
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
    <div className="flex flex-row gap-8">
      <Button className="btn" variant="destructive" onClick={onRemoveClick}>
        <Trash className="icon" />
      </Button>
    </div>
  );
};
