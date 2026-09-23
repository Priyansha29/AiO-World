# Nanny Mania — streamed game (development)

Nanny Mania is a Windows game (`NannyMania.exe`). We never run the `.exe` in the
browser. Instead the game runs locally under **Wine** on a virtual display, and a
**noVNC** proxy streams that display into the browser. AiO World just embeds the
stream in an iframe.

```
NannyMania.exe → Wine → Xvfb :99 → x11vnc :5900 → websockify :6080 → iframe
```

The Exe / ISO / BIN/CUE / extracted assets / Wine prefix are **not** part of this
repository. Nothing game-related is uploaded anywhere.

## How the page works

- Route: `#/play/nanny-mania` (registered in `src/App.jsx`).
- Page: `src/features/play/pages/NannyManiaPage.jsx`.
- Stream URL: `src/features/play/nanny-mania/config.js`.

The stream URL is configurable, so the local noVNC endpoint can later be replaced
by a backend-created game-session URL:

```sh
# default (used when unset)
VITE_NANNY_MANIA_URL="http://localhost:6080/vnc.html?autoconnect=true&resize=scale"

# example: later, a real session URL from a backend
VITE_NANNY_MANIA_URL="https://your-backend.example.com/sessions/abc123/vnc.html"
```

Set it as an env var for `npm run dev`:

```sh
VITE_NANNY_MANIA_URL="https://your-backend.example.com/..." npm run dev
```

or put `VITE_NANNY_MANIA_URL=...` in `frontend/.env.local` (gitignored) if you
want a persistent value.

The frontend never starts or stops the streaming stack — it only consumes the
stream.

## Start the local streaming stack

Requirements (Linux):

```sh
sudo apt install wine x11vnc novnc websockify
```

Then either use the helper script (see repo root):

```sh
scripts/nanny-mania-stream.sh            # full stack, launches the game in Wine
scripts/nanny-mania-stream.sh --no-game  # stream only; launch the game yourself
```

…or run the steps by hand:

```sh
# 1. virtual display
Xvfb :99 -screen 0 1024x768x24 -ac -nolisten tcp &

# 2. the game under Wine (path from your Wine prefix)
wine "$HOME/.wine/drive_c/Program Files (x86)/Nanny Mania/NannyMania.exe" &

# 3. expose the display over VNC
x11vnc -display :99 -forever -shared -rfbport 5900 &

# 4. bridge VNC → WebSocket for the browser
websockify --web=/usr/share/novnc/ 6080 localhost:5900 &
```

## Start AiO World

```sh
cd frontend
npm install
npm run dev
```

Open:

- AiO World game page: http://localhost:5173/#/play/nanny-mania
- Raw noVNC page (backup): http://localhost:6080/vnc.html?autoconnect=true&resize=scale

Click inside the game once before typing — the browser only sends keyboard input
to the iframe after it has focus.