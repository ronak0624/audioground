import _ from "lodash";
import { getAllTracks } from "@lib/store/tracks";
import { ProbeResult, Track } from "@lib/types";
import { TrackStatus } from "@/components/Table/cols";
import { getBasename } from "@lib/utils/fs";

export type TrackRow = Track & {
  id: string;
  status: TrackStatus;
  title: string;
  filename: string;
};

export function makeRow(path: string, item: Track): TrackRow {
  let status: TrackStatus = "untagged";
  if (!_.isEmpty(item.genre)) {
    status = "completed";
  }
  let filename = getBasename(path);
  let title = item.tags?.title ?? "";

  return {
    ...item.tags,
    ...item,
    id: path,
    status,
    title: title !== "" ? title : filename,
    filename,
    path,
  };
}

export default async function getRows() {
  const tracks = await getAllTracks();
  return _.map(tracks, ([path, item]) => makeRow(path, item));
}

export function makeRowFromFFProbe(info: ProbeResult): TrackRow {
  return makeRow(info.path, info);
}
