/**
 * Pack catalogue + character model.
 *
 * A "pack" is just a themed set of people. The game engine only ever sees a
 * generic Character, so new packs (Movies, Football, F1, Music, Friends,
 * custom course packs…) can be added later without touching the rules.
 */

export const CHARACTER_LIMIT = 12

export const GENDERS = ['male', 'female', 'other']
export const HAIRS = ['black', 'brown', 'blonde', 'red']
export const HAIR_LENGTHS = ['short', 'medium', 'long']
export const SKIN_TONES = ['light', 'medium', 'dark']
export const CLOTHING_COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'black', 'white']
export const ACCESSORIES = ['none', 'earrings', 'scarf', 'headphones']

/** The packs shown on the "Who are we guessing?" screen. */
export const GAME_PACKS = [
  {
    id: 'college',
    emoji: '🎓',
    title: 'College',
    description: 'Play with your classmates',
    status: 'available',
  },
  {
    id: 'movies',
    emoji: '🎬',
    title: 'Movies & TV',
    description: 'Characters you know',
    status: 'coming-soon',
  },
  {
    id: 'football',
    emoji: '⚽',
    title: 'Football',
    description: 'Players from the beautiful game',
    status: 'coming-soon',
  },
  {
    id: 'f1',
    emoji: '🏎️',
    title: 'F1',
    description: 'Drivers and legends',
    status: 'coming-soon',
  },
  {
    id: 'music',
    emoji: '🎵',
    title: 'Music',
    description: 'Artists and icons',
    status: 'coming-soon',
  },
]

export function getPack(packId) {
  return GAME_PACKS.find((p) => p.id === packId) ?? null
}

/** Blank attribute set used by the Add-character form. */
export function emptyCharacterDraft() {
  return {
    name: '',
    image: '',
    gender: 'male',
    hair: 'black',
    hairLength: 'short',
    glasses: false,
    beard: false,
    hat: false,
    skinTone: 'medium',
    clothing: 'red',
    accessory: 'none',
  }
}

/** Normalise anything (form draft / stored pack) into a Character. */
export function toCharacter(input, id) {
  const draft = { ...emptyCharacterDraft(), ...input }
  return {
    id: id ?? draft.id ?? '',
    name: String(draft.name ?? '').trim(),
    image: draft.image || '',
    gender: draft.gender,
    hair: draft.hair,
    hairLength: draft.hairLength,
    glasses: Boolean(draft.glasses),
    beard: Boolean(draft.beard),
    hat: Boolean(draft.hat),
    skinTone: draft.skinTone,
    clothing: draft.clothing,
    accessory: draft.accessory,
  }
}

/** Create an in-progress pack instance for a catalogue entry. */
export function createPack(meta) {
  return {
    id: meta.id,
    emoji: meta.emoji,
    title: meta.title,
    description: meta.description,
    status: meta.status,
    characters: [],
  }
}

/** First letters of a name, used for the photo fallback avatar. */
export function initialsFor(name) {
  const parts = String(name ?? '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
