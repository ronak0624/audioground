# Class to take list of paths as input and return list of AudioFeatures objects
import json
import os
import requests
import json
import numpy as np

from essentia.standard import (
    MonoLoader,
    TensorflowPredictEffnetDiscogs,
    TensorflowPredict2D,
    MetadataReader,
)

# TODO: General case for model that uses manifest to initialize the correct essentia algorithm

DEFAULT_MODELS = {
    "genre": "genre_discogs400-discogs-effnet-1",
    "instrument": "mtg_jamendo_instrument-discogs-effnet-1",
    "moods": "mtg_jamendo_moodtheme-discogs-effnet-1",
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

    def is_downloaded(self):
        return os.path.exists(self.get_path())

    def get_classes(self):
        return self.model_manifest["classes"]

    def get_path(self):
        return crosspath("models", f"{self.model}.pb")

    def get_algorithm(self):
        return self.model_manifest["inference"]["algorithm"]


class AudioFeatures:
    def __init__(self, paths, models=DEFAULT_MODELS):
        self.paths = paths
        self.models = {}
        for model in models.keys():
            manifest = ModelManifest(models[model])
            assert manifest.is_downloaded(), f"model {model} not downloaded"
            self.models[model] = manifest

    def get_paths(self):
        return self.paths

    def _parse_outputs(self, predictions, classes, threshold=0.1):
        predictions_mean = np.mean(predictions, axis=0)
        sorted_indices = np.argsort(predictions_mean)[::-1]
        filtered_indices = [
            i for i in sorted_indices if predictions_mean[i] > threshold
        ]
        labels = [classes[i] for i in filtered_indices]
        values = [predictions_mean[i] for i in filtered_indices]
        return labels, values

    def get_embeddings(self, audio):
        model_path = self.models["embeddings"].get_path()
        embedding_model = TensorflowPredictEffnetDiscogs(
            graphFilename=model_path, output="PartitionedCall:1"
        )
        return embedding_model(audio)

    def get_genre(self, ebds):
        genre_path = self.models["genre"].get_path()
        genre_classes = self.models["genre"].get_classes()
        genre_model = TensorflowPredict2D(
            graphFilename=genre_path,
            input="serving_default_model_Placeholder",
            output="PartitionedCall:0",
        )
        predictions = genre_model(ebds)
        parsed, _ = self._parse_outputs(predictions, genre_classes)
        return ", ".join(parsed).replace("---", ", ").split(", ")

    def get_mood(self, ebds):
        mood_path = self.models["moods"].get_path()
        mood_classes = self.models["moods"].get_classes()
        mood_model = TensorflowPredict2D(graphFilename=mood_path)
        predictions = mood_model(ebds)
        parsed, _ = self._parse_outputs(predictions, mood_classes, threshold=0.05)
        return parsed

    def get_instrument(self, ebds):
        instrument_path = self.models["instrument"].get_path()
        instrument_classes = self.models["instrument"].get_classes()
        instrument_model = TensorflowPredict2D(graphFilename=instrument_path)
        predictions = instrument_model(ebds)
        parsed, _ = self._parse_outputs(predictions, instrument_classes)
        return parsed

    def get_audio_features(self, audiopath):
        audio = MonoLoader(filename=audiopath, sampleRate=16000, resampleQuality=4)()

        tagpool = MetadataReader(filename=audiopath)()[7]
        entry = {
            "file_extension": os.path.splitext(audiopath)[1],
            "path": audiopath,
            "key": "A",  # FIXME: use CREPE to get key
            "bpm": "120",  # FIXME: use TempoCNN to get bpm
            # "key": f"{key}",
            # "bpm": tempo,
            "genres": [],
            "instrument": [],
            "moods": [],
        }
        if tagpool is not None:
            for d in tagpool.descriptorNames():
                entry[d.split(".")[-1]] = tagpool[d][0]

        if audio is None or len(audio) == 0:
            raise Exception("Audio file is empty")

        embeddings = self.get_embeddings(audio)

        if len(embeddings) == 0:
            entry["genres"] = ["unknown"]
            entry["moods"] = ["unknown"]
            entry["instrument"] = ["unknown"]
            return entry

        # predict genres
        entry["genres"] = self.get_genre(embeddings)

        # predict mood/theme
        entry["moods"] = self.get_mood(embeddings)

        # predict instruments
        entry["instrument"] = self.get_instrument(embeddings)

        res = json.dumps(entry)
        print(res, flush=True)
        return res

    def run(self):
        print("starting")
        return [self.get_audio_features(path) for path in self.paths]
