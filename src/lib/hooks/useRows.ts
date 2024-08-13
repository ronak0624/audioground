import { useState, useEffect } from "react";
import { Track } from "@lib/types";
import getRows from "@/components/Table/rows";
import _ from "lodash";

export default function useRows(): [
  Track[],
  React.Dispatch<React.SetStateAction<Track[]>>,
  () => void,
] {
  const [rows, setRows] = useState<Track[]>([]);

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
