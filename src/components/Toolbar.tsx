import { Button } from "@/components/ui/button";
import {
  ArrowDownToLineIcon,
  PlusCircleIcon,
  StopCircleIcon,
  TagIcon,
  Trash2Icon,
} from "lucide-react";

type ToolbarProps = {
  isRunning: boolean;
  onImport: () => void;
  onAutotag: () => void;
  onExport: () => void;
  onStopAutotag: () => void;
  onClearLibrary: () => void;
};

export default function Toolbar({
  isRunning,
  onImport,
  onAutotag,
  onExport,
  onStopAutotag,
  onClearLibrary,
}: ToolbarProps) {
  const isDepsInstalled = !!sessionStorage.getItem("venv");

  return (
    <div className="flex items-center w-full justify-between">
      <div className="flex items-center gap-5">
        <Button onClick={onImport} className="btn text-nowrap text-ellipsis">
          <PlusCircleIcon className="icon" />
          <span>Import</span>
        </Button>
        {isDepsInstalled && (
          <Button
            variant="secondary"
            onClick={onAutotag}
            className="btn text-nowrap text-ellipsis"
          >
            <TagIcon className="icon" />
            <span>Run Autotag</span>
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
