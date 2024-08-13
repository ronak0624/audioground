import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import type { ColDef } from "@ag-grid-community/core";
import { ModuleRegistry } from "@ag-grid-community/core";
import { twMerge } from "tailwind-merge";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";

import "./theme.module.css";
import { Search } from "../Search";
import { useDarkMode } from "@lib/hooks/useDarkMode";

import { PropsWithChildren, useMemo, useRef, useState } from "react";
import { debounce } from "lodash";
import { Button, ButtonProps } from "../ui/button";
import { ChevronsLeftRight, ChevronsRightLeft } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

// FIXME: Switch out with TrackData type
type TableRow = Record<string, any>;

export interface TableProps {
  cols: ColDef[];
  theme?: string;
  rows: TableRow[];
}

interface TableControlButtonProps extends ButtonProps {
  label: string;
}

const TableControlButton = (
  props: PropsWithChildren<TableControlButtonProps>,
) => {
  const { children, ...rest } = props;

  return (
    <Tooltip>
      <TooltipTrigger>
        <Button variant="outline" className="p-2 bg-transparent" {...rest}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{rest.label}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default function Table({
  theme = "ag-theme-quartz",
  cols,
  rows,
}: TableProps) {
  const [quickFilterText, setQuickFilterText] = useState<string>("");
  const { isDarkMode } = useDarkMode();
  const tableClass = isDarkMode ? `${theme}-dark` : theme;

  const gridRef = useRef<AgGridReact>(null);

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

  return (
    <div className="flex-1 flex flex-col gap-2">
      <div className="flex flex-row items-center w-full gap-2">
        <Search onChange={(e) => debounceQuickFilter(e.target.value)} />
        <TableControlButton label="Expand Columns" onClick={expandColumns}>
          <ChevronsLeftRight />
        </TableControlButton>
        <TableControlButton label="Contract Columns" onClick={contractColumns}>
          <ChevronsRightLeft />
        </TableControlButton>
      </div>
      <div className={twMerge(tableClass, "flex-1")}>
        <AgGridReact
          ref={gridRef}
          columnDefs={cols}
          rowData={rows}
          rowHeight={80}
          quickFilterText={quickFilterText}
        />
      </div>
    </div>
  );
}
