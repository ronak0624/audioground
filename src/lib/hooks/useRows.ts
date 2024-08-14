import { useState, useEffect } from "react";
import getRows, { TrackRow } from "@/components/Table/rows";
import _ from "lodash";

export default function useRows(): [
  TrackRow[],
  React.Dispatch<React.SetStateAction<TrackRow[]>>,
  () => void,
] {
  const [rows, setRows] = useState<TrackRow[]>([]);

  useEffect(() => {
    refreshRows();
  }, []);

  const refreshRows = () => {
    getRows().then((rows) => {
      setRows(rows);
    });
  };

  return [rows, setRows, refreshRows];
}
