import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import type {
  ColDef,
  GetRowIdParams,
  IRowNode,
  RowDoubleClickedEvent,
} from "@ag-grid-community/core";
import { ModuleRegistry } from "@ag-grid-community/core";
import { twMerge } from "tailwind-merge";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";

import "./theme.css";
import { Search } from "../Search";
import { useDarkMode } from "@lib/hooks/useDarkMode";

import {
  PropsWithChildren,
  useMemo,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";
import _, { debounce } from "lodash";
import { buttonVariants } from "../ui/button";
import {
  ChevronsLeftRight,
  ChevronsRightLeft,
  FileAudio,
  Pencil,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { TrackRow } from "./rows";
import Loader from "../Loader";
import { useAudio } from "@lib/providers/AudioProvider";
import TableContextMenu from "../TableContextMenu";
import { batchDeleteTracks } from "@lib/store/tracks";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export interface TableProps {
  cols: ColDef[];
  theme?: string;
  rows: TrackRow[];
  loading?: boolean;
}

interface TableControlButtonProps extends PropsWithChildren {
  label: string;
  onClick: () => void;
  className?: string;
}

const TableControlButton = (props: TableControlButtonProps) => {
  const { children, className, ...rest } = props;

  return (
    <Tooltip>
      <TooltipTrigger>
        <div
          className={twMerge(
            buttonVariants({ variant: "outline" }),
            "p-2 bg-transparent",
            className,
          )}
          onClick={props.onClick}
        >
          {children}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{rest.label}</p>
      </TooltipContent>
    </Tooltip>
  );
};

const EmptyState = () => {
  return (
    <div className="flex-1 flex flex-col gap-5 items-center justify-center text-muted-foreground">
      <FileAudio size={64} />
      <p>Drag some files here!</p>
    </div>
  );
};

const Table = forwardRef<AgGridReact, TableProps>(function Table(
  { theme = "ag-theme-quartz", cols, rows, loading },
  ref,
) {
  const [quickFilterText, setQuickFilterText] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<IRowNode[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { isDarkMode } = useDarkMode();
  const { play } = useAudio();
  const tableClass = isDarkMode ? `${theme}-dark` : theme;

  const gridRef = useRef<AgGridReact<TrackRow>>(null);

  // Attach the forwarded ref to the gridRef
  useImperativeHandle(ref, () => gridRef.current as AgGridReact);

  const debounceQuickFilter = useMemo(() => {
    return debounce((value: string) => {
      setQuickFilterText(value);
    }, 100);
  }, [quickFilterText]);

  const expandColumns = () => {
    if (gridRef.current) {
      gridRef.current.api.autoSizeAllColumns();
    }
  };

  const contractColumns = () => {
    if (gridRef.current) {
      gridRef.current.api.sizeColumnsToFit();
    }
  };

  const getRowId = useCallback(
    (params: GetRowIdParams) => String(params.data.path),
    [],
  );

  const handleRowDoubleClicked = async (e: RowDoubleClickedEvent<TrackRow>) => {
    if (isEditing) return;
    await play(e.data);
  };

  const getSelectedRows = () => {
    if (gridRef.current?.api) {
      const selectedNodes = gridRef.current.api.getSelectedNodes();
      setSelectedRows(selectedNodes);
    }
  };

  const onCopyPath = async () => {
    const paths = _.compact(_.map(selectedRows, "data.path"));
    await navigator.clipboard.writeText(paths.join("\n"));
  };

  const onDelete = async () => {
    const api = gridRef.current?.api;
    if (!api) return;

    const rows: TrackRow[] = gridRef.current?.api.getSelectedRows();
    const paths = _.compact(_.map(rows, "path"));
    await batchDeleteTracks(paths);
    api.applyTransaction({ remove: rows });
  };

  const handleIsEditing = () => {
    if (isEditing) {
      gridRef.current?.api.stopEditing();
    }
    setIsEditing((prev) => !prev);
  };

  return (
    <div className="flex-1 flex flex-col gap-2">
      <div className="flex flex-row items-center w-full gap-2">
        <Search onChange={(e) => debounceQuickFilter(e.target.value)} />
        <TableControlButton
          className={
            isEditing
              ? "bg-accent-foreground text-accent hover:bg-primary hover:text-primary-foreground"
              : ""
          }
          label="Edit Mode"
          onClick={handleIsEditing}
        >
          <Pencil className="icon" />
        </TableControlButton>
        <TableControlButton label="Fit Content" onClick={expandColumns}>
          <ChevronsLeftRight className="icon" />
        </TableControlButton>
        <TableControlButton label="Fit Screen" onClick={contractColumns}>
          <ChevronsRightLeft className="icon" />
        </TableControlButton>
      </div>
      <div className={twMerge(tableClass, "flex-1")}>
        <TableContextMenu
          onMount={getSelectedRows}
          onDelete={onDelete}
          onCopyPath={onCopyPath}
          selectedRows={selectedRows}
        >
          <AgGridReact
            ref={gridRef}
            className="bg-transparent"
            columnDefs={cols}
            rowData={rows}
            rowBuffer={40}
            rowHeight={80}
            loading={loading}
            noRowsOverlayComponent={EmptyState}
            suppressCellFocus
            suppressClickEdit={!isEditing}
            singleClickEdit
            editType="fullRow"
            undoRedoCellEditing
            // stopEditingWhenCellsLoseFocus
            onRowDoubleClicked={handleRowDoubleClicked}
            quickFilterText={quickFilterText}
            loadingOverlayComponent={Loader}
            getRowId={getRowId}
            rowSelection="multiple"
          />
        </TableContextMenu>
      </div>
    </div>
  );
});

export default Table;
