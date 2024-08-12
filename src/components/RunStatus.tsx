import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { AudioLabels } from "@lib/types";
import { Progress } from "./ui/progress";
import { useEffect } from "react";

type RunStatusProps = {
  progress: number;
  currentEntry: AudioLabels | undefined;
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
        <CardDescription className="text-foreground">
          Tagging {props.currentEntry?.path}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={props.progress * 100} max={100} />
      </CardContent>
    </Card>
  );
}
