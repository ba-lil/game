# Hexa Stack — Telegram Mini App

A lightweight, dependency-free Hexa Block-style puzzle built with vanilla HTML/CSS/JavaScript.

## Features

- True axial hexagonal board (radius 4 / 61 cells)
- 3-piece tray
- Pointer/touch drag-and-drop
- Three-axis line clearing
- Score + combo + best score
- Local progress persistence
- Sound toggle + Telegram haptic feedback
- Telegram Mini App initialization
- Responsive mobile-first UI
- No build step and no npm dependencies

## Run locally

A browser may block ES modules when opening `index.html` directly. Use a local HTTP server:

```bash
python -m http.server 8080
```

Then open:

`http://localhost:8080`

## Telegram deployment

1. Push this folder to a GitHub repository.
2. Host the repository with HTTPS, for example GitHub Pages.
3. Create/configure a Telegram bot with BotFather.
4. Set the Mini App/Web App URL to the HTTPS address.
5. Open the Mini App from Telegram.

The Telegram SDK is loaded from Telegram's official CDN in `index.html`.

## Production notes

This prototype is intentionally frontend-only. For competitive scoring, accounts, leaderboards, coins, anti-cheat validation, analytics, or cloud saves, add a server-side API and validate moves/scores on the server.

## Project structure

- `index.html` — app shell
- `css/main.css` — responsive UI
- `js/board.js` — axial hex-grid logic
- `js/pieces.js` — piece definitions/generator
- `js/game.js` — game rules
- `js/ui.js` — rendering and drag/drop
- `js/telegram.js` — Telegram Mini App API
- `js/storage.js` — local persistence
- `js/audio.js` — lightweight Web Audio effects
- `js/config.js` — tunable game configuration
