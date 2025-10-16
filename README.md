# Phaser Map Engine POC

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Phaser](https://img.shields.io/badge/Phaser-3.80-FF6B6B?style=flat&logo=phaser&logoColor=white)
![WebGL](https://img.shields.io/badge/WebGL-990000?style=flat&logo=webgl&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)

A map rendering engine built with Phaser.js, featuring advanced WebGL shaders and interactive province selection.

## 🚀 Live Demo

**[Try it live →](https://selimjb.github.io/phaser-map-poc/)**

## 🎨 Asset Generation Pipeline

Using OpenCV to produce optimized assets for WebGL shaders.

`./scripts/` contains a set of notebooks and image operations to produce shader assets. The process is different for each image. `map_assets_preprocessing.ipynb` is a template that can be used as a basis for asset generation.

More details on the processes here: [shader-image-map-playground](https://github.com/SelimJB/shader-image-map-playground)

### Example: From Simple Border to Interactive Map

**Using only this simple border image:**

![Border Input](./docs/image-20230531111542957.png)

**You can obtain this interactive map:**

![Interactive Map Effect](./docs/effect.gif)

**By generating these assets with OpenCV:**

![Generated Assets](./docs/image-20230531111633923.png)
![Generated Assets](./docs/image-20230531111555960.png)
![Generated Assets](./docs/image-20230531111607607.png)

**We can create many different interactive map styles:**  

![Map Demo](./docs/map.gif)

## ✨ Features

- Interactive province selection with hover effects
- Real-time WebGL shader rendering with 50+ configurable uniforms
- Multi-map support (Europa, World, Simple)
- Smart color quantization algorithm for province identification
- Automated asset preprocessing with Python/OpenCV
- React + Phaser integration
- Advanced visual effects (glow, contours, pulsations)

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Phaser 3.80
- **Rendering**: WebGL, Custom Fragment Shaders
- **Preprocessing**: Python, OpenCV, NumPy
- **Build**: Vite, ESLint, Prettier

