/**
 * Fun — "things worth doing" catalogue.
 *
 * Architecture
 * ------------
 * - FUN_CATEGORIES are the planned future sections. They are not all rendered
 *   yet — they exist so new sections can be grouped and built incrementally.
 * - FUN_COLLECTIONS are curated, reusable sections. Each is a heading plus
 *   supporting text plus a responsive grid of resource cards. Collections
 *   reference resource ids, so the same resource can be surfaced more than
 *   once without repeating its data.
 * - FUN_RESOURCES is the catalogue of interesting corners of the internet.
 *   Every entry links to the official site only — nothing is scraped, copied
 *   or mirrored here.
 *
 * Add a resource by appending to FUN_RESOURCES, then include its id in a
 * collection. It appears automatically — no JSX changes needed.
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
    id: 'smarter-internet',
    title: '10 Websites That Will Make You Smarter Than Most People',
    description:
      'Interesting corners of the internet for thinking, learning, experimenting and discovering something new.',
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
]

/** Look up a category by key, so cards can show a label and subtle accent. */
export function funCategory(key) {
  return FUN_CATEGORIES.find((category) => category.key === key) ?? { key, label: key, accent: '#ffa270' }
}

/** Resolve a collection's resource ids into their full resource records. */
export function resourcesFor(collection) {
  return collection.resourceIds
    .map((id) => FUN_RESOURCES.find((resource) => resource.id === id))
    .filter(Boolean)
}