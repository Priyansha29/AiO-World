/**
 * Local Play catalogue — the single source of truth for everything shown on
 * the Play page. Add games here as they ship; the page, randomizers and
 * filters all derive from this list, so nothing is hardcoded in JSX.
 */

export const GAME_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'quick', label: 'Quick' },
  { id: 'friends', label: 'Friends' },
  { id: 'trivia', label: 'Trivia' },
  { id: 'music', label: 'Music' },
]

export const games = [
  {
    id: 'guess-who',
    title: 'Guess Who',
    description:
      'Ask smart questions. Eliminate the impossible. Find the character before your opponent does.',
    tags: ['Social', 'Strategy'],
    players: '2 Players',
    status: 'available',
    route: '/play/guess-who',
    featured: true,
    accent: 'coral',
    motif: 'faces',
  },
  {
    id: 'guess-song',
    title: 'Guess the Song',
    description: 'How fast can you recognize a song?',
    tags: ['Music', 'Quick'],
    status: 'coming-soon',
    accent: 'peach',
    motif: 'song',
  },
  {
    id: 'who-knows-me',
    title: 'Who Knows Me Better?',
    description: 'Find out who actually knows you.',
    tags: ['Friends', 'Social'],
    status: 'coming-soon',
    accent: 'coral',
    motif: 'friends',
  },
  {
    id: 'quick-challenge',
    title: 'Quick Challenge',
    description: 'Small challenges. Very questionable bragging rights.',
    tags: ['Quick', '1–5 min'],
    status: 'coming-soon',
    accent: 'red',
    motif: 'timer',
  },
  {
    id: 'f1-challenge',
    title: 'F1 Challenge',
    description: 'Put your Formula 1 knowledge to the test.',
    tags: ['Trivia', 'F1'],
    status: 'coming-soon',
    accent: 'sand',
    motif: 'flag',
  },
]

/** Games that are playable right now (eligible for the randomizers). */
export const availableGames = (list = games) =>
  list.filter((game) => game.status === 'available' && game.route)

/** The flagship game, promoted in the featured section. */
export const featuredGame = (list = games) =>
  list.find((game) => game.featured) ?? null

/** Everything except the featured game — the "Pick something" grid. */
export const collectionGames = (list = games) =>
  list.filter((game) => !game.featured)

/** Filter the catalogue by a mood chip id ('all' returns everything). */
export function filterGames(list, filterId) {
  if (filterId === 'all') return list
  const match = filterId.toLowerCase()
  return list.filter((game) =>
    game.tags.some((tag) => tag.toLowerCase() === match),
  )
}

/** Pick a random AVAILABLE game, so new playable titles join automatically. */
export function pickRandomGame(list = games) {
  const pool = availableGames(list)
  if (pool.length === 0) return null
  return pool[Math.floor(Math.random() * pool.length)]
}