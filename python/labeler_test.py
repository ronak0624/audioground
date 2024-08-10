from labeler import AudioFeatures
import unittest


class TestAudioFeatures(unittest.TestCase):
    def test_get_paths(self):
        paths = ["path1", "path2"]
        audio_features = AudioFeatures(paths)
        self.assertEqual(audio_features.get_paths(), paths)
