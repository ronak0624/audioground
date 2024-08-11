import argparse
from labeler import AudioFeatures, download_defaults


if __name__ == "__main__":
    download_defaults()
    parser = argparse.ArgumentParser(description="Tag audio files.")
    parser.add_argument("--paths", nargs="*", help="list of paths to audio files")
    args = parser.parse_args()
    labeler = AudioFeatures(args.paths)
    labeler.run()
    print("done")
