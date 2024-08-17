import { useState, useEffect } from "react";
import getRows, { TrackRow } from "@/components/Table/rows";
import _ from "lodash";

export default function useRows(): [
  TrackRow[],
  React.Dispatch<React.SetStateAction<TrackRow[]>>,
  () => void,
  boolean,
] {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<TrackRow[]>([]);

  useEffect(() => {
    (async () => {
      await refreshRows();
    })();
  }, []);

  const refreshRows = async () => {
    setLoading(true);
    const rows = await getRows();
    setRows(rows);
    setLoading(false);
  };

  return [rows, setRows, refreshRows, loading];
}
