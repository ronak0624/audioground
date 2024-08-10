# Class to take list of paths as input and return list of AudioFeatures objects
class AudioFeatures:
    def __init__(self, paths):
        self.paths = paths

    def get_paths(self):
        return self.paths
