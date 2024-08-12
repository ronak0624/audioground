import { useMemo } from "react";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import type {
  ColDef,
  SizeColumnsToFitGridStrategy,
} from "@ag-grid-community/core";
import { ModuleRegistry } from "@ag-grid-community/core";
import { twMerge } from "tailwind-merge";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";

import "./theme.module.css";
import { Search } from "../Search";
import { useDarkMode } from "@lib/hooks/useDarkMode";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

// FIXME: Switch out with TrackData type
type TableRow = Record<string, any>;

export interface TableProps {
  cols: ColDef[];
  theme?: string;
  rows: TableRow[];
}

export default function Table({ theme, cols, rows }: TableProps) {
  if (!theme) {
    theme = "ag-theme-quartz";
  }
  const { isDarkMode } = useDarkMode();
  const tableClass = isDarkMode ? `${theme}-dark` : theme;
  const autoSizeStrategy = useMemo<SizeColumnsToFitGridStrategy>(
    () => ({
      type: "fitGridWidth",
    }),
    [],
  );

  return (
    <div className="flex-1 flex flex-col gap-2">
      <Search />
      <div className={twMerge(tableClass, "flex-1")}>
        <AgGridReact
          columnDefs={cols}
          rowData={rows}
          rowHeight={80}
          autoSizeStrategy={autoSizeStrategy}
        />
      </div>
    </div>
  );
}
