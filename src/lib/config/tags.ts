import genres from "../../../src-tauri/python/models/genre_discogs400-discogs-effnet-1.json";
import moods from "../../../src-tauri/python/models/mtg_jamendo_moodtheme-discogs-effnet-1.json";
import instrument from "../../../src-tauri/python/models/mtg_jamendo_instrument-discogs-effnet-1.json";
import { uniqBy } from "lodash";

const DELIMITER = "|";

const parseGenres = (genres: string[]) => {
  return uniqBy(
    genres.join(DELIMITER).replaceAll("---", DELIMITER).split(DELIMITER),
    (v) => v.toLowerCase(),
  );
};

const tags = {
  genres: parseGenres(genres.classes),
  moods: moods.classes,
  instrument: instrument.classes,
};

export default tags;
