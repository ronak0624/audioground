import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import type { ColDef, GetRowIdParams } from "@ag-grid-community/core";
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
import { debounce } from "lodash";
import { buttonVariants } from "../ui/button";
import { ChevronsLeftRight, ChevronsRightLeft } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { TrackRow } from "./rows";
import Loader from "../Loader";

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
}

const TableControlButton = (props: TableControlButtonProps) => {
  const { children, ...rest } = props;

  return (
    <Tooltip>
      <TooltipTrigger>
        <div
          className={twMerge(
            buttonVariants({ variant: "outline" }),
            "p-2 bg-transparent",
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

const Table = forwardRef<AgGridReact, TableProps>(function Table(
  { theme = "ag-theme-quartz", cols, rows, loading },
  ref,
) {
  const [quickFilterText, setQuickFilterText] = useState<string>("");
  const { isDarkMode } = useDarkMode();
  const tableClass = isDarkMode ? `${theme}-dark` : theme;

  const gridRef = useRef<AgGridReact>(null);

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

  return (
    <div className="flex-1 flex flex-col gap-2">
      <div className="flex flex-row items-center w-full gap-2">
        <Search onChange={(e) => debounceQuickFilter(e.target.value)} />
        <TableControlButton label="Fit Content" onClick={expandColumns}>
          <ChevronsLeftRight className="icon" />
        </TableControlButton>
        <TableControlButton label="Fit Screen" onClick={contractColumns}>
          <ChevronsRightLeft className="icon" />
        </TableControlButton>
      </div>
      <div className={twMerge(tableClass, "flex-1")}>
        <AgGridReact
          ref={gridRef}
          className="bg-transparent"
          columnDefs={cols}
          rowData={rows}
          rowBuffer={40}
          rowHeight={80}
          loading={loading}
          quickFilterText={quickFilterText}
          loadingOverlayComponent={Loader}
          getRowId={getRowId}
        />
      </div>
    </div>
  );
});

export default Table;
