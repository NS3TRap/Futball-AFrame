# 3D Multiplayer Football Game

**An interactive 3D football game using A-Frame and Networked A-Frame.**

[Overview](#overview) | [Features](#features) | [Technologies Used](#technologies-used) | [Usage](#usage) | [License](#license)

---

## Overview

This project aims to develop an interactive web-based multiplayer football game in a 3D environment, supporting both virtual reality (VR) and standard devices like PCs and mobile phones. The game enables real-time interaction between users, with features such as scoring, real-time results display, and integration of WebVR/WebXR technologies.

## Features

- **User Interface**: Real-time score and timer display.
- **Player Interaction**: Engage with the ball and other objects in the 3D environment.
- **Multiplayer Support**: Play in real-time with other players.
- **Game Results**: Overlay displays the winner or a draw.
- **Cross-Platform**: Supports VR headsets, PCs, and mobile devices.

## Technologies Used

### 3D Graphics and Physics

- **A-Frame (v1.6.0)**: Framework for building 3D and VR applications.
- **Aframe-Extras (v7.5.1)**: Adds extended components and systems for A-Frame.
- **Aframe-Physics-System (v4.2.2)**: Implements realistic physics interactions.
- **Aframe-Randomizer-Components (v3.0.2)**: Random generation of 3D objects and parameters.

### Multiplayer Logic

- **Networked-Aframe (v0.12.0)**: Synchronizes user actions in real-time.

### Game Mechanics

The game uses a multicast method for ball state synchronization. The host—determined as the last player to interact with the ball—broadcasts its position and rotation every 20ms, ensuring smooth gameplay and accurate goal detection. Only one ball exists on the field, eliminating score synchronization issues.

## Usage

### Prerequisites

- A modern browser with WebXR support.
- A VR headset, or standard PC/mobile device.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/3d-football-game.git

2. Install dependencies:
   ```bash
   npm install
3. Start the server:
   ```bash
   node index.js

The current implementation faces issues with ball “jerkiness” during host transitions. Efforts are ongoing to refine synchronization for a smoother gameplay experience.

Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests to improve the project.
