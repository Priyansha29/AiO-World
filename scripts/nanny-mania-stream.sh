#!/usr/bin/env bash
# Nanny Mania — local streaming stack (development only)
#
# Streams the Windows Nanny Mania game into a browser via:
#   NannyMania.exe -> Wine -> Xvfb :99 -> x11vnc :5900 -> websockify :6080
#
# The AiO World frontend does NOT start or stop this. Run it yourself before
# opening http://localhost:5173/#/play/nanny-mania
#
# Usage:
#   scripts/nanny-mania-stream.sh            # full stack (needs Wine + game)
#   scripts/nanny-mania-stream.sh --no-game  # stream only; launch the game yourself
#
# Stopping: Ctrl+C cleans up everything it started.

set -euo pipefail

DISPLAY_NUM=":99"
VNC_PORT=5900
WEB_PORT=6080
SCREEN_RES="1024x768x24"
EXE="$HOME/.wine/drive_c/Program Files (x86)/Nanny Mania/NannyMania.exe"

NO_GAME=0
if [[ "${1:-}" == "--no-game" ]]; then
  NO_GAME=1
fi

command -v Xvfb       >/dev/null || { echo "missing: Xvfb"; exit 1; }
command -v x11vnc     >/dev/null || { echo "missing: x11vnc"; exit 1; }
command -v websockify >/dev/null || { echo "missing: websockify"; exit 1; }

PIDS=()

cleanup() {
  echo
  echo "Stopping Nanny Mania stack…"
  local pid
  for pid in "${PIDS[@]}" websockify x11vnc wine; do
    pkill -f "${pid}" && echo "stopped: ${pid}" || true
  done
}
trap cleanup INT TERM EXIT

has() { pgrep -f "$1" >/dev/null 2>&1; }

if ! has "Xvfb ${DISPLAY_NUM}"; then
  echo "> Xvfb ${DISPLAY_NUM} (${SCREEN_RES})"
  Xvfb "${DISPLAY_NUM}" -screen 0 "${SCREEN_RES}" -ac -nolisten tcp &
  PIDS+=("Xvfb ${DISPLAY_NUM}")
  sleep 1
else
  echo "> Xvfb already running on ${DISPLAY_NUM}"
fi

export DISPLAY="${DISPLAY_NUM}"

if [[ "${NO_GAME}" -eq 0 ]] && [[ -f "${EXE}" ]]; then
  if ! has "NannyMania.exe"; then
    echo "> launching Nanny Mania under Wine"
    wine "${EXE}" &
    PIDS+=("NannyMania.exe")
    sleep 3
  else
    echo "> Nanny Mania already running"
  fi
else
  echo "> skipping game launch (configure it however you like inside Xvfb :99)"
fi

if ! has "x11vnc -display ${DISPLAY_NUM}"; then
  echo "> x11vnc on :${VNC_PORT}"
  x11vnc -display "${DISPLAY_NUM}" -forever -shared -rfbport "${VNC_PORT}" &
  PIDS+=("x11vnc -display ${DISPLAY_NUM}")
  sleep 1
else
  echo "> x11vnc already on :${VNC_PORT}"
fi

if ! has "websockify"; then
  echo "> websockify ${WEB_PORT} -> localhost:${VNC_PORT}"
  websockify --web=/usr/share/novnc/ "${WEB_PORT}" "localhost:${VNC_PORT}" &
  PIDS+=("websockify")
  sleep 1
else
  echo "> websockify already on :${WEB_PORT}"
fi

echo
echo "Nanny Mania stream ready:"
echo "  noVNC  http://localhost:${WEB_PORT}/vnc.html?autoconnect=true&resize=scale"
echo "  AiO    http://localhost:5173/#/play/nanny-mania"
echo
echo "Press Ctrl+C to stop."
wait