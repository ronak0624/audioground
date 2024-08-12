import Table from "@/components/Table";
import Toolbar from "@/components/Toolbar";
import useRows from "@lib/hooks/useRows";
import { chooseFolders, probeFiles } from "@lib/utils/fs";

import { colConfig } from "@/components/Table/cols";

export default function Home() {
  const [rows] = useRows();

  const handleImport = async () => {
    const files = await chooseFolders();
    if (!files) return;
    await probeFiles(files, (entry) => {
      console.log(entry);
    });
  };
  const handleAutotag = () => {};
  const handleExport = () => {};
  const handleStopAutotag = () => {};
  const handleClearLibrary = () => {};

  return (
    <div className="flex flex-col gap-5 h-full p-5">
      <Toolbar
        isRunning={false}
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
