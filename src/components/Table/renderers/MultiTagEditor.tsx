import { values } from "lodash";
import { CustomCellEditorProps } from "@ag-grid-community/react";

import Combobox from "@/components/Combobox";
import { TrackRow } from "../rows";
import MultiTagRenderer from "./MultiTagRenderer";

import useComboboxState from "@lib/hooks/useComboboxState";

export default (params: CustomCellEditorProps<TrackRow, string[]>) => {
  const { open, setOpen, items, updateValue } = useComboboxState(params);
  const { value } = params;

  return (
    <Combobox
      open={open}
      setOpen={setOpen}
      list={values(items)}
      onSelect={updateValue}
    >
      <MultiTagRenderer value={value} />
    </Combobox>
  );
};
