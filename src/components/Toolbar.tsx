import { Button } from "@/components/ui/button";
import {
  ArrowDownToLineIcon,
  PlusCircleIcon,
  StopCircleIcon,
  TagIcon,
  Trash2Icon,
  RefreshCcw,
  AudioLines,
} from "lucide-react";
import Titlebar from "./Titlebar";

type ToolbarProps = {
  isRunning: boolean;
  isImporting: boolean;
  onImport: () => void;
  onAutotag: () => void;
  onExport: () => void;
  onStopAutotag: () => void;
  onClearLibrary: () => void;
};

export default function Toolbar({
  isRunning,
  isImporting,
  onImport,
  onAutotag,
  onExport,
  onStopAutotag,
  onClearLibrary,
}: ToolbarProps) {
  const isDepsInstalled = !!sessionStorage.getItem("venv");

  return (
    <div
      data-tauri-drag-region
      className="flex items-center w-full justify-between relative"
    >
      <div className="flex items-center gap-5">
        <div className="self-start">
          <Titlebar />
        </div>
        <Button onClick={onImport} className="btn text-nowrap text-ellipsis">
          {isImporting ? (
            <RefreshCcw className="icon animate-spin" />
          ) : (
            <PlusCircleIcon className="icon" />
          )}
          <span>Import</span>
        </Button>
        {isDepsInstalled && (
          <Button
            variant="secondary"
            onClick={onAutotag}
            className="btn text-nowrap text-ellipsis"
          >
            <TagIcon className="icon" />
            <span>Autotag</span>
          </Button>
        )}
        <Button
          variant="secondary"
          onClick={onExport}
          className="btn text-nowrap text-ellipsis ml-auto"
        >
          <ArrowDownToLineIcon className="icon" />
          <span>Export</span>
        </Button>
      </div>
      <div className="absolute min-w-min left-1/2 right-1/2 -translate-x-1/2 flex gap-2  pointer-events-none">
        <AudioLines className="text-foreground" />
        <p className="text-">audioground</p>
      </div>
      <div className="flex items-center gap-5">
        {isRunning && (
          <Button
            variant="secondary"
            onClick={onStopAutotag}
            className="btn text-nowrap text-ellipsis"
          >
            <StopCircleIcon className="icon" />
            <span>Stop</span>
          </Button>
        )}
        <Button
          variant="destructive"
          onClick={onClearLibrary}
          className="btn text-nowrap text-ellipsis"
        >
          <Trash2Icon className="icon" />
          <span>Clear Library</span>
        </Button>
      </div>
    </div>
  );
}
