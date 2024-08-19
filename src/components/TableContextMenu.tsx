import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { PropsWithChildren } from "react";
import { TrackRow } from "./Table/rows";
import { IRowNode } from "@ag-grid-community/core";
import { Copy, Trash2 } from "lucide-react";

type TableContextMenuProps = PropsWithChildren<{
  onCopyPath?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onMount?: () => void;
  selectedRows: IRowNode<TrackRow>[];
}>;

export default function TableContextMenu({
  children,
  onCopyPath,
  onDelete,
  // onEdit,
  onMount,
  selectedRows,
}: TableContextMenuProps) {
  const count = selectedRows?.length;

  return (
    <ContextMenu onOpenChange={onMount}>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={onCopyPath}>
          <Copy className="icon pr-1" />
          Copy {count} Path(s)
        </ContextMenuItem>
        {/* {count <= 1 && <ContextMenuItem onClick={onEdit}>Edit</ContextMenuItem>} */}
        <ContextMenuItem onClick={onDelete}>
          <Trash2 className="icon pr-1" />
          Delete {count} tracks
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
