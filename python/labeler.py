# Class to take list of paths as input and return list of AudioFeatures objects
import json
import os


class ModelManifest:
    def __init__(self, model):
        self.model = model
        self.model_path = os.path.join(
            os.path.dirname(__file__), "models", f"{model}.json"
        )
        with open(self.model_path, "r") as f:
            self.model_manifest = json.load(f)

    def get_classes(self):
        return self.model_manifest["classes"]

    def get_algorithm(self):
        return self.model_manifest["inference"]["algorithm"]


class AudioFeatures:
    def __init__(self, paths):
        self.paths = paths

    def get_paths(self):
        return self.paths
