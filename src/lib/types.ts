export interface TrackInfo {
  id: number;
  title: string;
  date: string;
  path: string;
  filename: string;
  thumbnail?: string;
  artist?: string;
  checked?: boolean;
}

export type ProbeResult = {
  filename: string;
  path: string;
  tags: Partial<{
    duration: number;
    genre: string;
    artist: string;
    album: string;
    date: string;
    title: string;
    comment: string;
    thumbnail: string;
  }>;
};
export interface AudioLabels {
  file_extension: string;
  key: string;
  duration: number;
  bpm: string;
  genre: string;
  instrument: string;
  moods: string;
  path: string;
  timestamp: string;
}

export type Track = Partial<ProbeResult> & Partial<AudioLabels>;
