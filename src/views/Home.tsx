import _ from "lodash";
import { open } from "@tauri-apps/api/dialog";

import Table from "@/components/Table";
import Toolbar from "@/components/Toolbar";
import useRows from "@lib/hooks/useRows";
import { chooseFolders, probeFiles } from "@lib/utils/fs";

import { colConfig } from "@/components/Table/cols";
import { makeRowFromFFProbe } from "@/components/Table/rows";
import useTagRunner from "@lib/hooks/useTagRunner";
import { deleteAllTracks, getUntaggedTracks } from "@lib/store/tracks";

export default function Home() {
  const [rows, setRows] = useRows();
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
    if (!untagged.length) return;
    await runner.start(untagged);
  };

  const handleExport = () => {};

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
        isRunning={runner.status === "running"}
        onImport={handleImport}
        onAutotag={handleAutotag}
        onExport={handleExport}
        onStopAutotag={handleStopAutotag}
        onClearLibrary={handleClearLibrary}
      />
      <Table cols={colConfig} rows={rows} />
    </div>
  );
}
