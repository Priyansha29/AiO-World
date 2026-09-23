/**
 * Nanny Mania is streamed from the local noVNC proxy for now.
 *
 * This is a development/proof-of-concept integration. The page only ever
 * consumes a URL — it never starts the streaming stack, Wine, Xvfb or the
 * VNC proxy. Later, VITE_NANNY_MANIA_URL can point at a backend-created
 * game-session URL and nothing else in the page needs to change.
 */
export const NANNY_MANIA_STREAM_URL =
  import.meta.env.VITE_NANNY_MANIA_URL ??
  'http://localhost:6080/vnc.html?autoconnect=true&resize=scale'