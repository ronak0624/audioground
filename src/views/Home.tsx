import _ from "lodash";
import { open } from "@tauri-apps/api/dialog";

import Table from "@/components/Table";
import Toolbar from "@/components/Toolbar";
import useRows from "@lib/hooks/useRows";
import { chooseFolders, probeFiles } from "@lib/utils/fs";

import { colConfig } from "@/components/Table/cols";
import { makeRowFromFFProbe } from "@/components/Table/rows";
import useTagRunner from "@lib/hooks/useTagRunner";
import {
  deleteAllTracks,
  exportDataset,
  getUntaggedTracks,
} from "@lib/store/tracks";
import { toast } from "sonner";
import RunStatus from "@/components/RunStatus";

export default function Home() {
  const [rows, setRows, refreshRows] = useRows();
  const runner = useTagRunner();

  const handleImport = async () => {
    const selected = await open({
      directory: true,
      multiple: true,
    });
    if (!selected) return;

    const files = await chooseFolders(selected);
    await probeFiles(files, (entry) => {
      console.log(entry);
      setRows((prev) =>
        _.uniqBy([...prev, makeRowFromFFProbe(entry, prev.length)], "path"),
      );
    });
  };

  const handleAutotag = async () => {
    const untagged = (await getUntaggedTracks()).map((t) => t[0]);
    if (!untagged.length) {
      toast.error("No files selected.");
      return;
    }

    toast.info(`Tagging ${untagged.length} files.`);
    await runner.start(untagged, onRunComplete);
  };

  const onRunComplete = () => {
    refreshRows();
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
      />
      <RunStatus
        progress={runner.progress}
        currentEntry={runner.currentEntry}
        status={runner.status}
      />
      <Table cols={colConfig} rows={rows} />
    </div>
  );
}
