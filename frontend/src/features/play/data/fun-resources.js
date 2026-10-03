/**
 * Fun — mood-based discovery catalogue.
 *
 * Architecture
 * ------------
 * - FUN_RESOURCES is the single catalogue of interesting corners of the
 *   internet. Every resource exists ONCE here and is referenced by id from the
 *   homepage and the full catalogue. Nothing is duplicated. Every entry links
 *   to the official site only — nothing is scraped, copied or mirrored here.
 * - FUN_MOODS drive the Fun homepage: pick a mood and resources are filtered in
 *   place. Moods are not mutually exclusive — a resource carries several.
 * - FUN_CATEGORIES group resources by theme on the full catalogue page and
 *   give cards a subtle accent. Categories stay separate from moods; each
 *   resource has exactly one primary category.
 */

export const FUN_MOODS = [
  { key: 'bored', label: "I'm bored" },
  { key: 'explore', label: 'I want to explore' },
  { key: 'play', label: 'I want to play' },
  { key: 'learn', label: 'I want to learn' },
  { key: 'weird', label: 'I want something weird' },
  { key: 'relax', label: 'I want to relax' },
  { key: 'create', label: 'I want to create' },
  { key: 'discover', label: 'I want to discover something new' },
]

export const FUN_CATEGORIES = [
  { key: 'brain', label: 'Brain & Skills', accent: '#ffa270' },
  { key: 'experiments', label: 'Interactive Experiments', accent: '#ffc193' },
  { key: 'games', label: 'Games', accent: '#ff8383' },
  { key: 'books', label: 'Books & Discovery', accent: '#e6b26e' },
  { key: 'creativity', label: 'Creativity', accent: '#ff9a6b' },
  { key: 'science', label: 'Science', accent: '#8fbf9f' },
  { key: 'useful', label: 'Useful Websites', accent: '#7fb1c9' },
  { key: 'friends', label: 'Things To Do With Friends', accent: '#d39ac2' },
  { key: 'travel', label: 'Travel & Exploration', accent: '#8fc0d6' },
  { key: 'history', label: 'History', accent: '#b0a3d9' },
  { key: 'weird', label: 'Weird & Random', accent: '#f0a7c8' },
]

export const FUN_RESOURCES = [
  {
    id: 'human-benchmark',
    title: 'Human Benchmark',
    description: 'Measure your reaction time, memory and other cognitive skills in quick, test-yourself challenges.',
    category: 'brain',
    moods: ['play', 'learn'],
    url: 'https://humanbenchmark.com/',
    tags: ['memory', 'reaction', 'focus'],
    type: 'website',
  },
  {
    id: 'quick-draw',
    title: 'Quick, Draw!',
    description: 'Sketch a doodle in twenty seconds while a neural network tries to guess what it is.',
    category: 'experiments',
    moods: ['play', 'create'],
    url: 'https://quickdraw.withgoogle.com/',
    tags: ['drawing', 'ai', 'experiment'],
    type: 'website',
  },
  {
    id: 'supercook',
    title: 'SuperCook',
    description: 'Tell it what is already in your kitchen and it finds recipes you can actually cook tonight.',
    category: 'useful',
    moods: ['create', 'discover'],
    url: 'https://supercook.com/',
    tags: ['recipes', 'cooking', 'pantry'],
    type: 'website',
  },
  {
    id: 'lichess-practice',
    title: 'Lichess Practice',
    description: 'Free chess lessons and solving puzzles, from the first moves to sharp tactics.',
    category: 'games',
    moods: ['play', 'learn'],
    url: 'https://lichess.org/practice',
    tags: ['chess', 'puzzles', 'strategy'],
    type: 'website',
  },
  {
    id: 'whichbook',
    title: 'Whichbook',
    description: 'Find your next read with filters like bold, dark or funny — instead of genres.',
    category: 'books',
    moods: ['discover', 'relax'],
    url: 'https://whichbook.net/',
    tags: ['books', 'reading', 'discovery'],
    type: 'website',
  },
  {
    id: 'untools',
    title: 'Untools',
    description: 'A growing collection of thinking tools for clearer decisions and better problem-solving.',
    category: 'brain',
    moods: ['learn', 'discover'],
    url: 'https://untools.co/',
    tags: ['thinking', 'decisions', 'design'],
    type: 'website',
  },
  {
    id: 'phet-simulations',
    title: 'PhET Simulations',
    description: 'Interactive science and math simulations that make abstract ideas feel hands-on.',
    category: 'science',
    moods: ['learn', 'explore'],
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
    moods: ['play', 'learn'],
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
    moods: ['create', 'learn'],
    url: 'https://www.instructables.com/',
    tags: ['diy', 'making', 'engineering'],
    type: 'website',
  },
  {
    id: 'evolution-of-trust',
    title: 'The Evolution of Trust',
    description: 'An interactive essay-game about why cooperation happens and when trust falls apart.',
    category: 'games',
    moods: ['play', 'learn'],
    url: 'https://ncase.me/trust/',
    tags: ['game', 'psychology', 'cooperation'],
    type: 'website',
    linkLabel: 'Play it',
  },
  {
    id: 'virtual-vacation',
    title: 'Virtual Vacation',
    description: 'Get dropped into a Street View location somewhere on Earth and try to guess where in the world you are.',
    category: 'travel',
    moods: ['explore', 'bored'],
    url: 'https://virtualvacation.us/',
    tags: ['travel', 'geography', 'guessing'],
    type: 'website',
  },
  {
    id: 'bored',
    title: 'Bored.com',
    description: 'A directory of fun, interesting and cool websites to explore when you have nothing to do.',
    category: 'useful',
    moods: ['bored', 'discover'],
    url: 'https://www.bored.com/',
    tags: ['directory', 'websites', 'boredom'],
    type: 'website',
  },
  {
    id: 'quenq-vice-city',
    title: 'Quenq · Vice City',
    description: 'Grand Theft Auto: Vice City running directly in your browser, hosted by Quenq\'s museum of internet culture.',
    category: 'games',
    moods: ['play', 'weird'],
    url: 'https://quenq.com/apps/vice-city-online',
    tags: ['game', 'retro', 'nostalgia'],
    type: 'website',
    linkLabel: 'Play it',
  },
  {
    id: 'dear-future-me',
    title: 'Dear Future Me',
    description: 'Write a letter to your future self and have it emailed to you weeks, months or years from now.',
    category: 'creativity',
    moods: ['create', 'relax'],
    url: 'https://www.futureme.org/',
    tags: ['letters', 'writing', 'reflection'],
    type: 'website',
  },
  {
    id: 'the-little-daily',
    title: 'The Little Daily',
    description: 'A tiny paper full of quick daily puzzles and games — a short reset with absolutely no news.',
    category: 'games',
    moods: ['play', 'bored'],
    url: 'https://thelittledaily.com/',
    tags: ['puzzles', 'daily', 'games'],
    type: 'website',
    linkLabel: 'Play it',
  },
  {
    id: 'window-swap',
    title: 'WindowSwap',
    description: 'Open a window somewhere in the world and watch a short clip of someone else\'s view.',
    category: 'travel',
    moods: ['explore', 'relax'],
    url: 'https://www.window-swap.com/',
    tags: ['travel', 'views', 'quiet'],
    type: 'website',
    linkLabel: 'Explore',
  },
  {
    id: 'achievement-cake',
    title: 'Achievement Cake',
    description: 'Turn an accomplishment into a shared online cake that friends decorate with photos and memories.',
    category: 'friends',
    moods: ['create', 'discover'],
    url: 'https://achievementcake.com/',
    tags: ['celebration', 'friends', 'memories'],
    type: 'website',
  },
  {
    id: 'histography',
    title: 'Histography',
    description: 'Scroll through history as a living timeline where every dot is an event, each pulled from Wikipedia.',
    category: 'history',
    moods: ['learn', 'explore'],
    url: 'https://www.histography.io/',
    tags: ['history', 'timeline', 'wikipedia'],
    type: 'website',
    linkLabel: 'Explore',
  },
  {
    id: 'floor796',
    title: 'Floor796',
    description: 'One huge, ever-expanding animation of life on the 796th floor of a space station, crammed with references to memes, games, films and anime.',
    category: 'weird',
    moods: ['weird', 'bored', 'explore'],
    url: 'https://floor796.com/',
    tags: ['animation', 'easter-eggs', 'wandering'],
    type: 'website',
    linkLabel: 'Explore',
  },
  {
    id: 'windows93',
    title: 'Windows93',
    description: 'A fake operating system that runs in your browser — a Windows parody packed with odd built-in apps and easter eggs.',
    category: 'weird',
    moods: ['weird', 'play'],
    url: 'https://www.windows93.net/',
    tags: ['parody', 'web-os', 'retro'],
    type: 'website',
    linkLabel: 'Try it',
  },
  {
    id: 'anna-garden',
    title: 'Anna\'s Garden',
    description: 'A quiet shared online garden where visitors add flowers and drawings to grow a small island together.',
    category: 'experiments',
    moods: ['relax', 'create'],
    url: 'https://annasgarden.vercel.app/',
    tags: ['garden', 'drawing', 'collaborative'],
    type: 'website',
    linkLabel: 'Try it',
  },
  {
    id: 'the-useless-web',
    title: 'The Useless Web',
    description: 'One click sends you to a random, gloriously pointless website — and then another, and another.',
    category: 'weird',
    moods: ['bored', 'weird'],
    url: 'https://www.theuselessweb.com/',
    tags: ['random', 'absurd', 'time-waster'],
    type: 'website',
  },
]

/** Look up a mood by key. */
export function funMood(key) {
  return FUN_MOODS.find((mood) => mood.key === key) ?? { key, label: key }
}

/** Look up a category by key, so cards can show a label and subtle accent. */
export function funCategory(key) {
  return FUN_CATEGORIES.find((category) => category.key === key) ?? { key, label: key, accent: '#ffa270' }
}

/** Resources that match a single mood. */
export function resourcesForMood(moodKey) {
  return FUN_RESOURCES.filter((resource) => resource.moods.includes(moodKey))
}

/** Resources matching the given search query and any selected moods or categories. */
export function resourcesMatching({ query = '', moods = [], categories = [] } = {}) {
  const term = query.trim().toLowerCase()
  return FUN_RESOURCES.filter((resource) => {
    if (moods.length > 0 && !moods.some((mood) => resource.moods.includes(mood))) return false
    if (categories.length > 0 && !categories.includes(resource.category)) return false
    if (term) {
      const haystack = `${resource.title} ${resource.description} ${resource.tags.join(' ')}`.toLowerCase()
      if (!haystack.includes(term)) return false
    }
    return true
  })
}

/** A single random resource from the whole catalogue — the "surprise me" pick. */
export function randomResource() {
  return FUN_RESOURCES[Math.floor(Math.random() * FUN_RESOURCES.length)] ?? FUN_RESOURCES[0]
}