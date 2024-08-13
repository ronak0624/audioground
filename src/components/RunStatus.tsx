import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { AudioLabels } from "@lib/types";
import { Progress } from "./ui/progress";
import { useEffect } from "react";
import { RunnerStatus } from "@lib/hooks/useTagRunner";

type RunStatusProps = {
  progress: number;
  currentEntry: AudioLabels | undefined;
  status: RunnerStatus;
};

export default function RunStatus(props: RunStatusProps) {
  useEffect(() => {
    console.log(props.progress);
  }, [props.progress]);

  if (!props.progress) {
    return <></>;
  }

  return (
    <Card>
      <CardHeader>
        {props.status === "Running" ? (
          <CardDescription className="text-foreground">
            Tagging {props.currentEntry?.path}
          </CardDescription>
        ) : (
          <CardDescription className="text-foreground">
            {props.status}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <Progress value={props.progress * 100} max={100} />
      </CardContent>
    </Card>
  );
}
