import Toolbar from "@/templates/Toolbar";

export default function Home() {
  const handleImport = () => {};
  const handleAutotag = () => {};
  const handleExport = () => {};
  const handleStopAutotag = () => {};
  const handleClearLibrary = () => {};

  return (
    <div className="flex flex-col items-start">
      <Toolbar
        isRunning={false}
        onImport={handleImport}
        onAutotag={handleAutotag}
        onExport={handleExport}
        onStopAutotag={handleStopAutotag}
        onClearLibrary={handleClearLibrary}
      />
    </div>
  );
}
