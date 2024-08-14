import Combobox from "@/components/Combobox";
import { CustomCellEditorProps } from "@ag-grid-community/react";
import { TrackRow } from "../rows";

import { useMemo, useState } from "react";
import { setTrack } from "@lib/store/tracks";

const KEYS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export default function KeyEditor(
  params: CustomCellEditorProps<TrackRow, string>,
) {
  const [open, setOpen] = useState(true);
  const {
    value,
    node: { data },
    column,
    onValueChange,
  } = params;

  const items = useMemo(
    () =>
      KEYS.map((key) => ({
        value: key,
        selected: value === key,
      })),
    [value],
  );

  const columnId = column.getColId();

  const updateValue = async (val: string) => {
    if (val === "") return;

    onValueChange(val);

    if (!data?.id) return;

    await setTrack(
      data.id,
      {
        ...data,
        [columnId]: val,
      },
      false,
    );
  };

  return (
    <Combobox
      placeholder="Choose key..."
      open={open}
      setOpen={setOpen}
      list={items}
      onSelect={updateValue}
    >
      {value}
    </Combobox>
  );
}
