import argparse
from labeler import AudioFeatures


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Tag audio files.")
    parser.add_argument("--paths", nargs="*", help="list of paths to audio files")
    args = parser.parse_args()
    labeler = AudioFeatures(args.paths)
    print(labeler.get_paths())
