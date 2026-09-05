# Smash & Char — Gourmet Burgers 🍔

> 🚀 **Vercel (Production):** [https://burger-nine-mocha.vercel.app](https://burger-nine-mocha.vercel.app)  
> 🌐 **GitHub Pages:** [https://yug1204.github.io/burger-/](https://yug1204.github.io/burger-/)

A single-page restaurant website for a gourmet burger brand featuring a scroll-driven cinematic hero section.

## Features
- **Scroll-Scrubbed Hero Video**: The video is locked in a pinned viewport (400vh) and scrubbed in sync with the user's scroll position (forward and reverse).
- **Synchronized Ingredient Checkpoints**: Text and layer callouts fade in and out at key timestamps corresponding to the burger's assembly (fresh buns, wagyu beef, aged cheddar, crisp veggies, and signature sauce).
- **High-Performance Video Encoding**: Custom keyframe-dense MP4 (`-g 2`, `-bf 0`) and WebM versions ensure zero-latency seeking in browser hardware decoders without frame drops or freeze.
- **Modern Responsive Design**: Warm, appetizing aesthetic with charred brown, mustard yellow, and tomato red accents, paired with Google Fonts (`Outfit` and `Inter`).
- **Complete Restaurant Landing Page**: Includes Signatures Menu grid, "Art of the Smash" story section, location/hours, and Call to Action buttons.

## Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/yug1204/burger-.git
cd burger-
```

### 2. Start the local server
Because video scrubbing requires HTTP Byte-Range requests (`HTTP 206 Partial Content`), run the included Python server:
```bash
python server.py 8000
```
Or use any modern web server that supports Range headers (e.g. `npx serve`, Vite, Live Server).

### 3. Open in Browser
Visit [http://localhost:8000](http://localhost:8000) and scroll down to assemble the burger!

## Tech Stack
- HTML5 / CSS3 (Vanilla)
- Vanilla JavaScript
- [GSAP 3](https://greensock.com/gsap/) & [ScrollTrigger](https://greensock.com/scrolltrigger/)
