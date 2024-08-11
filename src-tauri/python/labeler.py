# Class to take list of paths as input and return list of AudioFeatures objects
import json
import os
import requests
import os
import json

DEFAULT_MODELS = {
    "genre": "genre_discogs400-discogs-effnet-1",
    "instrument": "mtg_jamendo_instrument-discogs-effnet-1",
    "mood": "mtg_jamendo_moodtheme-discogs-effnet-1",
    "embeddings": "discogs-effnet-bs64-1",
}


def crosspath(*paths):
    return os.path.normpath(os.path.join(os.path.dirname(__file__), *paths))


def download_model(model_id):
    manifest = json.load(open(crosspath(f"models/{model_id}.json"), "r"))
    link = manifest["link"]
    filename = link.split("/")[-1]

    model_path = crosspath(f"models/{filename}")

    if os.path.exists(model_path):
        return

    response = requests.get(link)
    with open(model_path, "wb") as f:
        f.write(response.content)


def download_defaults():
    for model in DEFAULT_MODELS.values():
        download_model(model)


class ModelManifest:
    def __init__(self, model):
        self.model = model
        self.manifest_path = crosspath("models", f"{model}.json")
        assert os.path.exists(self.manifest_path), f"manifest for {model} not found"

        with open(self.manifest_path, "r") as f:
            self.model_manifest = json.load(f)

    def get_classes(self):
        return self.model_manifest["classes"]

    def get_path(self):
        return crosspath("models", f"{self.model}.pb")

    def get_algorithm(self):
        return self.model_manifest["inference"]["algorithm"]


class AudioFeatures:
    def __init__(self, paths, models=DEFAULT_MODELS):
        self.paths = paths
        self.models = models
        for model in models.keys():
            self.assert_model(model)

    def assert_model(self, model):
        assert model in self.models, f"{model} not specified"
        model_path = ModelManifest(self.models[model]).get_path()
        assert os.path.exists(model_path), f"{model} model not found"

    def get_paths(self):
        return self.paths
