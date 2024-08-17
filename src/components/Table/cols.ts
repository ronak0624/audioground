import { ActionsCellRenderer } from "./renderers/ActionsCellRenderer";
import { TitleCellRenderer } from "./renderers/TitleCellRenderer";
import StatusCellRenderer from "./renderers/StatusCellRenderer";
import MultiTagRenderer from "./renderers/MultiTagRenderer";
import { ColDef, ValueFormatterFunc } from "@ag-grid-community/core";

import { setTrack } from "@lib/store/tracks";
import MultiTagEditor from "./renderers/MultiTagEditor";
import KeyEditor from "./renderers/KeyEditor";

const statuses = {
  completed: "Completed",
  untagged: "Untagged",
  pending: "Pending",
};

export type TrackStatus = keyof typeof statuses;

const statusFormatter: ValueFormatterFunc = ({ value }) => {
  return statuses[value as TrackStatus] ?? "";
};

const tagFormatter: ValueFormatterFunc = ({ value }) => {
  return value.join(", ");
};

export const colConfig: ColDef[] = [
  {
    field: "title",
    headerName: "Title",
    cellRenderer: TitleCellRenderer,
    editable: true,
    valueSetter: (params) => {
      setTrack(params.data.path, { tags: { title: params.newValue } });
      params.data.title = params.newValue;
      return true;
    },
    flex: 1,
    width: 300,
  },
  {
    field: "artist",
    initialWidth: 100,
    width: 100,
    editable: true,
    valueSetter: (params) => {
      setTrack(params.data.path, { tags: { artist: params.newValue } });
      params.data.artist = params.newValue;
      return true;
    },
  },

  {
    field: "key",
    headerName: "Key",
    editable: true,
    cellEditor: KeyEditor,
    width: 75,
  },
  {
    field: "bpm",
    headerName: "BPM",
    cellEditor: "agNumberCellEditor",
    editable: true,
    width: 75,
    valueSetter: (params) => {
      setTrack(params.data.path, { bpm: params.newValue.toString() });
      params.data.bpm = params.newValue;
      return true;
    },
    comparator: (a, b) => {
      a = a || "0";
      b = b || "0";
      if (a == b) return 0;

      return parseInt(a) > parseInt(b) ? 1 : -1;
    },
    valueFormatter: ({ value }) => (value > 0 ? `${value}` : ""),
  },
  {
    field: "instrument",
    headerName: "Instrument",
    width: 150,
    cellRenderer: MultiTagRenderer,
    editable: true,
    cellEditor: MultiTagEditor,
    filter: true,
    filterParams: {
      valueFormatter: tagFormatter,
    },
  },
  {
    field: "genres",
    headerName: "Genres",
    cellRenderer: MultiTagRenderer,
    editable: true,
    cellEditor: MultiTagEditor,
    width: 150,
    filter: true,
    filterParams: {
      valueFormatter: tagFormatter,
    },
  },
  {
    field: "moods",
    headerName: "Mood",
    width: 150,
    cellRenderer: MultiTagRenderer,
    editable: true,
    cellEditor: MultiTagEditor,
    filter: true,
    filterParams: {
      valueFormatter: tagFormatter,
    },
  },
  { field: "actions", cellRenderer: ActionsCellRenderer, width: 100 },
  {
    field: "status",
    valueFormatter: statusFormatter,
    cellRenderer: StatusCellRenderer,
    width: 75,
  },
];
