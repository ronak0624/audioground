import argparse
from labeler import AudioFeatures
import os
import json
from glob import glob
import requests


def download_models():
    models = glob("models/*.json")
    for model in models:
        with open(f"{model}", "r") as f:
            model = json.load(f)
            link = model["link"]
            filename = link.split("/")[-1]

            if os.path.exists(f"models/{filename}"):
                continue
            response = requests.get(link)
            with open(f"{filename}", "wb") as f:
                f.write(response.content)


if __name__ == "__main__":
    download_models()
    parser = argparse.ArgumentParser(description="Tag audio files.")
    parser.add_argument("--paths", nargs="*", help="list of paths to audio files")
    args = parser.parse_args()
    labeler = AudioFeatures(args.paths)
    print(labeler.get_paths())
