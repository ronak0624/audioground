import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "./ui/progress";
import { PropsWithChildren } from "react";
import { TagRunnerResult } from "@lib/hooks/useTagRunner";
import Loader from "./Loader";

type RunStatusProps = TagRunnerResult;

const InnerText = (props: PropsWithChildren<{ loading?: boolean }>) => {
  if (props.loading) {
    return (
      <div className="flex items-center gap-5">
        <Loader /> <div>{props.children}</div>
      </div>
    );
  }
  return <div className="flex items-center">{props.children}</div>;
};

const StatusText = (props: RunStatusProps) => {
  switch (props.status) {
    case "Running":
      return (
        <div className="flex flex-col">
          <InnerText loading>
            <div className="font-bold">
              {props.progress} / {props.total}{" "}
            </div>{" "}
            <div>{props.currentEntry.path}</div>
          </InnerText>
          {/* <div>
            <p>{props.currentEntry.moods}</p>
            <p>{props.currentEntry.instrument}</p>
          </div> */}
        </div>
      );
    case "Stopped":
      return <InnerText>Stopped</InnerText>;
    case "Error":
      return <InnerText>{props.status}</InnerText>;
    case "Initializing":
      return <InnerText loading>Initializing...</InnerText>;
    case "Downloading":
      return (
        <InnerText loading>
          Fresh installation detected. Downloading models...
        </InnerText>
      );
    default:
      return <InnerText>{props.status}</InnerText>;
  }
};

export default function RunStatus(props: RunStatusProps) {
  if (!props.progress) {
    return <></>;
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription className="text-foreground">
          <StatusText {...props} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={(props.progress / props.total) * 100} />
      </CardContent>
    </Card>
  );
}
