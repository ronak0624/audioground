import Table from "@/components/Table";
import Toolbar from "@/components/Toolbar";

export default function Home() {
  const handleImport = () => {};
  const handleAutotag = () => {};
  const handleExport = () => {};
  const handleStopAutotag = () => {};
  const handleClearLibrary = () => {};

  return (
    <div className="flex flex-col h-full">
      <Toolbar
        isRunning={false}
        onImport={handleImport}
        onAutotag={handleAutotag}
        onExport={handleExport}
        onStopAutotag={handleStopAutotag}
        onClearLibrary={handleClearLibrary}
      />
      <Table
        cols={[
          {
            field: "key",
            headerName: "Key",
            width: 75,
          },
        ]}
        rows={[{ key: "TEST TABLE" }]}
      />
    </div>
  );
}
