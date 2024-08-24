<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a id="readme-top"></a>

<!-- [![Contributors][contributors-shield]][contributors-url] -->
<!-- [![Forks][forks-shield]][forks-url] -->
<!-- [![Stargazers][stars-shield]][stars-url] -->

<!-- [![Issues][issues-shield]][issues-url] -->

![Ubuntu Support](https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white)
![macOS Support](https://img.shields.io/badge/MACOS-adb8c5?style=for-the-badge&logo=macos&logoColor=white)
<br />
[![MIT License][license-shield]][license-url]

<!-- [![LinkedIn][linkedin-shield]][linkedin-url] -->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/ronak0624/audioground">
    <img src="src-tauri/icons/128x128.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">audioground</h3>

  <p align="center">
    Local AI-powered music autotagger. Use your hardware to tag your music library.
    <!-- <br /> -->
    <!-- <a href="https://github.com/ronak0624/audioground"><strong>Explore the docs »</strong></a> -->
    <!-- <br /> -->
    <br />
    <a href="https://github.com/ronak0624/audioground/releases">Install</a>
    ·
    <a href="https://github.com/ronak0624/audioground/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/ronak0624/audioground/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

<img src="docs/assets/demo.gif" />

If you have a large, local music library, it can be a pain to sift through your tracks
to find the right one. This project aims to make that process easier by using a full suite of ML models to add
rich tags based on the audio content of your tracks. This way, you can search for
tracks based on their content and structure, not just by title, artist, or basic genre.
If you are a DJ with tons of songs on your USB, a record producer with a large
collection of random samples, or just a listener who doesn't like streaming services, this tool can help you get more out of your library.

#### Key Features:

- **Local**: No need to upload your music to a server. Once the models are downloaded, everything runs offline.
- **Robust**: Over 400+ genres and subgenres, 50+ mood/emotion tags, and 30+ instrument tags, and many more to come.
- **Fast**: GPU-accelerated if your hardware allows for it. Tag full songs in seconds.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

[![React][React.js]][React-url]
[![Vite][Vite.js]][Vite-url]
[![Tauri][Tauri.app]][Tauri-url]
[![Tailwind][Tailwind]][Tailwind-url]
[![Python][Python]][Python-url]
[![Rust][Rust]][Rust-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Installation

### Prerequisites

Requires Python 3.10+. Install the latest version of Python from [python.org](https://www.python.org/downloads/).

You can download the latest release from the [releases page](https://github.com/ronak0624/audioground/releases). The app is currently available for macOS, and Linux. The fully installed version is ~1GB. The app will download the necessary models on first run.

<!-- GETTING STARTED -->

## Local Development

To get a local clone/fork up and running follow these steps.

### Prerequisites

Requires Python 3.10+. Install the latest version of Python from [python.org](https://www.python.org/downloads/).

Make sure the correct version is available in your $PATH:

```sh
python --version
```

You will also need to install Tauri and it's prerequisites for your system. Follow the instructions on the [Tauri website](https://tauri.app/v1/guides/getting-started/prerequisites).

### Installation

1. Clone the repo (OR clone your own fork)
   ```sh
   git clone https://github.com/ronak0624/audioground.git
   ```
2. Install NPM packages
   ```sh
   npm install
   # OR
   bun install
   ```
3. Run tauri dev server
   ```sh
   bun run tauri dev
   ```
4. To work with the ML inference scripts directly,
   ```sh
   # this will download the models from essentia.upf.edu
   npm run download:models
   # OR
   bun run download:models
   ```
   ```sh
   # Create virtual environment
   cd src-tauri/python
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```
   ```sh
   # to run the inference script
   python main.py --paths path/to/audio1 path/to/audio2 ...
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

[![audioground screenshot][product-screenshot]](https://github.com/ronak0624/audioground)

- Drag and drop your music folder into the app.
- Click Autotag and wait for some tags to appear. Depending on your hardware and library size, this can take a few minutes to a few hours.
- Search for tags in the search bar to filter your library, or export all of your tags to .json

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [ ] ONNX model architecture (cross-platform/no python required)
- [ ] Library stats
- [ ] Smart playlists
- [ ] Model zoo (choose your own models for each tagging run)

See the [open issues](https://github.com/ronak0624/audioground/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>
 
<!-- ### Top contributors:

<a href="https://github.com/ronak0624/audioground/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ronak0624/audioground" alt="contrib.rocks image" />
</a> -->

<!-- LICENSE -->

## License

Distributed under the AGPL-3.0 License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

<!-- <p align="right">(<a href="#readme-top">back to top</a>)</p> -->

<!-- ACKNOWLEDGMENTS -->

## Credits

- [essentia](https://essentia.upf.edu/)
- [shadcn](https://ui.shadcn.com/)
- [audiotags](https://docs.rs/audiotags/latest/audiotags/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[contributors-shield]: https://img.shields.io/github/contributors/ronak0624/audioground.svg?style=for-the-badge
[contributors-url]: https://github.com/ronak0624/audioground/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/ronak0624/audioground.svg?style=for-the-badge
[forks-url]: https://github.com/ronak0624/audioground/network/members
[stars-shield]: https://img.shields.io/github/stars/ronak0624/audioground.svg?style=for-the-badge
[stars-url]: https://github.com/ronak0624/audioground/stargazers
[issues-shield]: https://img.shields.io/github/issues/ronak0624/audioground.svg?style=for-the-badge
[issues-url]: https://github.com/ronak0624/audioground/issues
[license-shield]: https://img.shields.io/github/license/ronak0624/audioground.svg?style=for-the-badge
[license-url]: https://github.com/ronak0624/audioground/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/ronakwebdev
[product-screenshot]: docs/assets/demo.jpg
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vite.js]: https://img.shields.io/badge/Vite-272731?style=for-the-badge&logo=vite
[Vite-url]: https://vitejs.dev/
[Tauri.app]: https://img.shields.io/badge/Tauri-393939?style=for-the-badge&logo=tauri
[Tauri-url]: https://v2.tauri.app/
[Tailwind]: https://img.shields.io/badge/Tailwind-152342?style=for-the-badge&logo=tailwindcss
[Tailwind-url]: https://tailwindcss.com/
[Python]: https://img.shields.io/badge/Python-646464?style=for-the-badge&logo=python
[Python-url]: https://www.python.org/
[Rust]: https://img.shields.io/badge/Rust-494948?style=for-the-badge&logo=rust
[Rust-url]: https://www.rust-lang.org/
