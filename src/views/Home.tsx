import _ from "lodash";
import { open } from "@tauri-apps/api/dialog";

import Table from "@/components/Table";
import Toolbar from "@/components/Toolbar";
import useRows from "@lib/hooks/useRows";
import { chooseFolders, probeFiles } from "@lib/utils/fs";

import { colConfig } from "@/components/Table/cols";
import { makeRow, makeRowFromFFProbe } from "@/components/Table/rows";
import useTagRunner from "@lib/hooks/useTagRunner";
import {
  deleteAllTracks,
  exportDataset,
  getTrack,
  getUntaggedTracks,
} from "@lib/store/tracks";
import { toast } from "sonner";
import RunStatus from "@/components/RunStatus";
import { useRef, useState } from "react";
import { AudioLabels } from "@lib/types";
import { AgGridReact } from "@ag-grid-community/react";

export default function Home() {
  const [rows, setRows, refreshRows] = useRows();
  const runner = useTagRunner();
  const [importing, setImporting] = useState(false);

  const gridRef = useRef<AgGridReact>(null);

  const handleImport = async () => {
    setImporting(true);
    const selected = await open({
      directory: true,
      multiple: true,
    });
    if (!selected) {
      setImporting(false);
      return;
    }

    const files = await chooseFolders(selected);
    await probeFiles(files, async (entry) => {
      const row = await makeRowFromFFProbe(entry);
      setRows((prev) => _.uniqBy([...prev, row], "path"));
    });
    setImporting(false);
  };

  const handleAutotag = async () => {
    const untagged = (await getUntaggedTracks()).map((t) => t[0]);
    if (!untagged.length) {
      toast.success("All files are already tagged.");
      return;
    }

    toast.info(`Tagging ${untagged.length} files.`);
    await runner.start(untagged, onRunComplete, onStdout);
  };

  const onRunComplete = () => {
    if (runner.status !== "Error") {
      toast.success(`Done tagging.`);
    }
    refreshRows();
  };

  const onStdout = async (update: AudioLabels) => {
    const entry = await getTrack(update.path);

    gridRef.current?.api.applyTransaction({
      update: [makeRow(update.path, { ...entry, ...update })],
    });
  };

  const handleExport = async () => {
    await exportDataset();
  };

  const handleStopAutotag = async () => {
    await runner.stop();
  };

  const handleClearLibrary = async () => {
    const shouldDelete = await deleteAllTracks();
    if (shouldDelete) {
      setRows([]);
    }
  };

  return (
    <div className="flex flex-col gap-5 h-full p-5">
      <Toolbar
        isRunning={runner.status === "Running"}
        onImport={handleImport}
        onAutotag={handleAutotag}
        onExport={handleExport}
        onStopAutotag={handleStopAutotag}
        onClearLibrary={handleClearLibrary}
        isImporting={importing}
      />
      <RunStatus {...runner} />
      <Table ref={gridRef} cols={colConfig} rows={rows} />
    </div>
  );
}
