from labeler import AudioFeatures, ModelManifest
import unittest


class TestAudioFeatures(unittest.TestCase):
    def test_get_paths(self):
        paths = ["path1", "path2"]
        audio_features = AudioFeatures(paths)
        self.assertEqual(audio_features.get_paths(), paths)

    def test_model_manifest(self):
        model_manifest = ModelManifest("discogs-effnet-bs64-1")
        self.assertTrue(isinstance(model_manifest.get_classes(), list))
        self.assertEqual(
            model_manifest.get_algorithm(), "TensorflowPredictEffnetDiscogs"
        )
