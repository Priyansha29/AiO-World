/**
 * Fun — "things worth doing" catalogue.
 *
 * Architecture
 * ------------
 * - FUN_RESOURCES is the single catalogue of interesting corners of the
 *   internet. Every resource exists ONCE here and is referenced by id from
 *   the homepage (featured) and from collections. Nothing is duplicated.
 *   Every entry links to the official site only — nothing is scraped, copied
 *   or mirrored here.
 * - FUN_COLLECTIONS are reusable, just-data collections:
 *   `{ id, title, description, route, resourceIds }`. The generic collection
 *   page (`/fun/:collectionId`) renders any of them, so adding a future
 *   collection means: 1) add the collection entry, 2) add resource ids.
 *   Empty collections render as a clean "Coming soon" state — never with
 *   fake resources.
 * - FUN_FEATURED_IDS drive the small homepage "Featured" row. They reference
 *   the same records as the collections.
 * - FUN_CATEGORIES group resources by theme and give cards a subtle accent.
 */

export const FUN_CATEGORIES = [
  { key: 'brain', label: 'Brain & Skills', accent: '#ffa270' },
  { key: 'experiments', label: 'Interactive Experiments', accent: '#ffc193' },
  { key: 'games', label: 'Games', accent: '#ff8383' },
  { key: 'books', label: 'Books & Discovery', accent: '#e6b26e' },
  { key: 'creativity', label: 'Creativity', accent: '#ff9a6b' },
  { key: 'science', label: 'Science', accent: '#8fbf9f' },
  { key: 'useful', label: 'Useful Websites', accent: '#7fb1c9' },
  { key: 'friends', label: 'Things To Do With Friends', accent: '#d39ac2' },
]

const FUN_RESOURCES = [
  {
    id: 'human-benchmark',
    title: 'Human Benchmark',
    description: 'Measure your reaction time, memory and other cognitive skills in quick, test-yourself challenges.',
    category: 'brain',
    url: 'https://humanbenchmark.com/',
    tags: ['memory', 'reaction', 'focus'],
    type: 'website',
  },
  {
    id: 'quick-draw',
    title: 'Quick, Draw!',
    description: 'Sketch a doodle in twenty seconds while a neural network tries to guess what it is.',
    category: 'experiments',
    url: 'https://quickdraw.withgoogle.com/',
    tags: ['drawing', 'ai', 'experiment'],
    type: 'website',
  },
  {
    id: 'supercook',
    title: 'SuperCook',
    description: 'Tell it what is already in your kitchen and it finds recipes you can actually cook tonight.',
    category: 'useful',
    url: 'https://supercook.com/',
    tags: ['recipes', 'cooking', 'pantry'],
    type: 'website',
  },
  {
    id: 'lichess-practice',
    title: 'Lichess Practice',
    description: 'Free chess lessons and solving puzzles, from the first moves to sharp tactics.',
    category: 'games',
    url: 'https://lichess.org/practice',
    tags: ['chess', 'puzzles', 'strategy'],
    type: 'website',
  },
  {
    id: 'whichbook',
    title: 'Whichbook',
    description: 'Find your next read with filters like bold, dark or funny — instead of genres.',
    category: 'books',
    url: 'https://whichbook.net/',
    tags: ['books', 'reading', 'discovery'],
    type: 'website',
  },
  {
    id: 'untools',
    title: 'Untools',
    description: 'A growing collection of thinking tools for clearer decisions and better problem-solving.',
    category: 'brain',
    url: 'https://untools.co/',
    tags: ['thinking', 'decisions', 'design'],
    type: 'website',
  },
  {
    id: 'phet-simulations',
    title: 'PhET Simulations',
    description: 'Interactive science and math simulations that make abstract ideas feel hands-on.',
    category: 'science',
    url: 'https://phet.colorado.edu/',
    tags: ['science', 'math', 'simulation'],
    type: 'website',
    linkLabel: 'Explore',
  },
  {
    id: 'spent',
    title: 'SPENT',
    description: 'An online experience about money, hard decisions and what living on a tight budget is actually like.',
    category: 'experiments',
    url: 'https://playspent.org/',
    tags: ['money', 'decisions', 'experience'],
    type: 'website',
    linkLabel: 'Play it',
  },
  {
    id: 'instructables',
    title: 'Instructables',
    description: 'Step-by-step instructions for making, fixing and building things — from first timer to weekend engineer.',
    category: 'creativity',
    url: 'https://www.instructables.com/',
    tags: ['diy', 'making', 'engineering'],
    type: 'website',
  },
  {
    id: 'evolution-of-trust',
    title: 'The Evolution of Trust',
    description: 'An interactive essay-game about why cooperation happens and when trust falls apart.',
    category: 'games',
    url: 'https://ncase.me/trust/',
    tags: ['game', 'psychology', 'cooperation'],
    type: 'website',
    linkLabel: 'Play it',
  },
]

export const FUN_COLLECTIONS = [
  {
    id: 'smart-websites',
    title: '10 Websites That Will Make You Smarter Than Most People',
    description:
      'Interesting corners of the internet for thinking, learning and discovering something new.',
    route: '/fun/smart-websites',
    resourceIds: [
      'human-benchmark',
      'quick-draw',
      'supercook',
      'lichess-practice',
      'whichbook',
      'untools',
      'phet-simulations',
      'spent',
      'instructables',
      'evolution-of-trust',
    ],
  },
  {
    id: 'interactive',
    title: 'Interactive Experiments',
    description: 'Play with ideas, simulations and experiments.',
    route: '/fun/interactive',
    resourceIds: [],
  },
  {
    id: 'games',
    title: 'Games',
    description: 'Quick games and experiences worth trying.',
    route: '/fun/games',
    resourceIds: [],
  },
  {
    id: 'creative',
    title: 'Creative',
    description: 'Make, build and experiment.',
    route: '/fun/creative',
    resourceIds: [],
  },
  {
    id: 'books',
    title: 'Books & Discovery',
    description: 'Interesting things to read, explore and discover.',
    route: '/fun/books',
    resourceIds: [],
  },
  {
    id: 'friends',
    title: 'With Friends',
    description: 'Things to explore and do together.',
    route: '/fun/friends',
    resourceIds: [],
  },
]

/** Small homepage "Featured" row — same records as the collections, by id. */
export const FUN_FEATURED_IDS = ['human-benchmark', 'quick-draw', 'phet-simulations']

/** Look up a category by key, so cards can show a label and subtle accent. */
export function funCategory(key) {
  return FUN_CATEGORIES.find((category) => category.key === key) ?? { key, label: key, accent: '#ffa270' }
}

/** Look up a collection by id. */
export function funCollection(id) {
  return FUN_COLLECTIONS.find((collection) => collection.id === id)
}

/** Resolve a collection's resource ids into their full resource records. */
export function resourcesFor(collection) {
  return collection.resourceIds
    .map((id) => FUN_RESOURCES.find((resource) => resource.id === id))
    .filter(Boolean)
}

/** Number of resources a collection actually has id references for. */
export function resourceCount(collection) {
  return collection.resourceIds.length
}

/** The homepage "Featured" resources, in the given order. */
export function featuredResources() {
  return FUN_FEATURED_IDS.map((id) => FUN_RESOURCES.find((resource) => resource.id === id)).filter(Boolean)
}