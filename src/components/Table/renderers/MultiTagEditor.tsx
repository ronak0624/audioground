import Combobox, { ComoboxValue } from "@/components/Combobox";
import { CustomCellEditorProps } from "@ag-grid-community/react";
import { useMemo, useState } from "react";
import { TrackRow } from "../rows";
import { uniqBy } from "lodash";
import MultiTagRenderer from "./MultiTagRenderer";

import tags from "@/lib/config/tags";
import { setTrack } from "@lib/store/tracks";

export default (params: CustomCellEditorProps<TrackRow, string[]>) => {
  const [open, setOpen] = useState(true);

  const {
    onValueChange,
    column,
    node: { data },
  } = params;
  let { value } = params;
  value = value ?? [];

  const columnId = column.getColId() as keyof typeof tags;

  // Combine dynamic and static tags.
  const items = useMemo(() => {
    const res: Record<string, ComoboxValue> = {};
    for (const tag of tags[columnId]) {
      res[tag] = {
        value: tag,
        selected: false,
      };
    }
    for (const tag of value) {
      res[tag] = {
        value: tag,
        selected: true,
      };
    }
    return res;
  }, [value]);

  const updateValue = async (val: string) => {
    if (val === "") return;

    let changes: string[] = [];

    // If the tag is already selected, remove it.
    if (items[val].selected) {
      changes = value.filter((v) => v !== val);
    } else {
      changes = [...value, val];
    }

    changes = uniqBy(changes, (v) => v.toLowerCase());
    onValueChange(changes);

    if (!data?.id) return;
    console.log(changes);
    await setTrack(
      data.id,
      {
        ...data,
        [columnId]: changes,
      },
      false,
    );
  };

  return (
    <Combobox
      open={open}
      setOpen={setOpen}
      list={items}
      onSelect={(val) => updateValue(val)}
    >
      <MultiTagRenderer value={value} />
    </Combobox>
  );
};
