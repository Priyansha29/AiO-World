/**
 * Cute custom Guess Who avatars.
 *
 * The whole character is generated deterministically from a small set of
 * appearance attributes — no images, no uploads, nothing external. The same
 * component is used in the creator preview, the pack list, secret selection,
 * the game board and the result screen, so a character always looks the same
 * wherever it appears.
 */

const SKIN_TONES = {
  light: '#FFD9B3',
  medium: '#D99A6C',
  dark: '#8B5A32',
}

const HAIR_COLORS = {
  black: '#2C2A32',
  brown: '#7B4A2B',
  blonde: '#E8C466',
  red: '#B8503C',
}

const CLOTHING = {
  red: '#E2574C',
  blue: '#4C78C4',
  green: '#4C9A6B',
  yellow: '#E8C25C',
  purple: '#8B5DB0',
  black: '#31353C',
  white: '#F7F7F9',
}

const EYE = '#3A2E2E'
const MOUH = '#B4553F'

const BACK_OFFSET = { short: 0, medium: 7, long: 14 }

// Front hair cap silhouettes per style. The hat sits on top and the face,
// glasses and beard are painted after, so the cap reads as hair around them.
const HAIR_CAPS = {
  straight: 'M 30 47 C 28 22 44 16 60 16 C 76 16 92 22 90 47 C 72 42 48 42 30 47 Z',
  bangs: 'M 30 46 C 28 22 44 16 60 16 C 76 16 92 22 90 46 C 80 46 70 56 60 57 C 50 56 40 46 30 46 Z',
  wavy: 'M 30 47 C 30 30 38 24 48 24 C 44 38 46 46 52 47 C 56 40 55 24 64 23 C 72 26 70 38 76 40 C 84 36 88 28 90 34 C 91 42 90 47 90 47 C 72 42 48 42 30 47 Z',
  curly: 'M 30 47 C 30 30 36 24 44 22 C 42 13 56 9 62 15 C 66 8 82 10 82 20 C 90 18 94 28 90 36 C 91 43 90 47 90 47 C 72 42 48 42 30 47 Z',
  bob: 'M 30 47 C 28 22 44 16 60 16 C 76 16 92 22 90 47 C 90 66 84 72 78 74 C 66 77 54 77 42 74 C 36 72 30 66 30 47 Z',
}

function BackHair({ offset, color }) {
  const loop = 70 + offset
  const base = 84 + offset
  return (
    <path
      d={`M 30 46 L 30 ${loop} C 33 ${base} 44 ${base + 4} 54 ${base + 4} L 66 ${base + 4} C 76 ${base + 4} 87 ${base} 90 ${loop} L 90 46 Z`}
      fill={color}
    />
  )
}

function HairCap({ style, color }) {
  return <path d={HAIR_CAPS[style] ?? HAIR_CAPS.straight} fill={color} />
}

function Head({ skin }) {
  return (
    <g>
      <circle cx="60" cy="56" r="26" fill={skin} />
      {/* cheeks */}
      <circle cx="44" cy="66" r="4" fill="rgba(226, 87, 76, 0.25)" />
      <circle cx="76" cy="66" r="4" fill="rgba(226, 87, 76, 0.25)" />
    </g>
  )
}

function Ears({ skin, earrings }) {
  return (
    <g>
      <circle cx="34" cy="58" r="5" fill={skin} />
      <circle cx="86" cy="58" r="5" fill={skin} />
      {earrings && (
        <g fill="#E0AE4E">
          <circle cx="34" cy="66" r="2.6" />
          <circle cx="86" cy="66" r="2.6" />
        </g>
      )}
    </g>
  )
}

function Eyes({ glasses }) {
  return (
    <g>
      <ellipse cx="48" cy="60" rx="3.4" ry="4.4" fill={EYE} />
      <ellipse cx="72" cy="60" rx="3.4" ry="4.4" fill={EYE} />
      {glasses && (
        <g stroke="#2E2E33" strokeWidth="2.4" fill="rgba(255,255,255,0.28)">
          <rect x="40" y="54" width="16" height="16" rx="5" />
          <rect x="64" y="54" width="16" height="16" rx="5" />
          <path d="M 56 62 L 64 62" fill="none" strokeWidth="2" />
        </g>
      )}
    </g>
  )
}

function Mouth({ beard }) {
  if (beard) return null
  return (
    <path
      d="M 50 70 Q 60 77 70 70"
      fill="none"
      stroke={MOUH}
      strokeWidth="2.6"
      strokeLinecap="round"
    />
  )
}

function Beard({ color }) {
  return (
    <g fill={color}>
      <path d="M 43 61 C 40 76 47 87 60 87 C 73 87 80 76 77 61 C 72 68 48 68 43 61 Z" />
      <path d="M 43 61 Q 60 71 77 61 L 77 56 Q 60 65 43 56 Z" />
    </g>
  )
}

function Scarf({ color }) {
  return (
    <g>
      <rect x="40" y="79" width="40" height="11" rx="5.5" fill={color} />
      <rect x="55" y="84" width="11" height="24" rx="5.5" fill={color} />
      <rect x="55" y="84" width="11" height="4" rx="2" fill="rgba(0,0,0,0.12)" />
    </g>
  )
}

function Headphones() {
  return (
    <g>
      <path
        d="M 32 44 A 28 28 0 0 1 88 44"
        fill="none"
        stroke="#2F3338"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <rect x="27" y="48" width="11" height="18" rx="5.5" fill="#2F3338" />
      <rect x="82" y="48" width="11" height="18" rx="5.5" fill="#2F3338" />
      <circle cx="32.5" cy="62" r="2" fill="#E2574C" />
      <circle cx="87.5" cy="62" r="2" fill="#E2574C" />
    </g>
  )
}

function Hat() {
  return (
    <g>
      <path d="M 34 44 C 32 18 88 18 86 44 C 78 46 42 46 34 44 Z" fill="#E2574C" />
      <rect x="32" y="42" width="56" height="9" rx="4.5" fill="#C9483C" />
      <circle cx="60" cy="20" r="7" fill="#F3E9DB" />
    </g>
  )
}

function Body({ cloth }) {
  return (
    <g>
      <path
        d="M 31 96 Q 31 90 38 90 L 82 90 Q 89 90 89 96 L 89 120 L 31 120 Z"
        fill={cloth}
        stroke={cloth === CLOTHING.white ? '#E7E7EC' : 'none'}
        strokeWidth="1.2"
      />
      <path d="M 31 112 L 89 112 L 89 120 L 31 120 Z" fill="rgba(0,0,0,0.08)" />
    </g>
  )
}

/**
 * Render a person from their appearance attributes.
 * Accepts any object carrying the flat attribute fields (gender, skinTone,
 * hair, hairLength, hairStyle, glasses, beard, hat, clothing, accessory).
 */
export default function CharacterAvatar({ character, className }) {
  const skinTone = character.skinTone ?? 'medium'
  const hair = character.hair ?? 'black'
  const clothing = character.clothing ?? 'red'
  const length = character.hairLength ?? 'short'
  const style = character.hairStyle ?? 'straight'

  const skin = SKIN_TONES[skinTone] ?? SKIN_TONES.medium
  const hairColor = HAIR_COLORS[hair] ?? HAIR_COLORS.black
  const clothColor = CLOTHING[clothing] ?? CLOTHING.red
  const accessory = character.accessory ?? 'none'
  const beard = Boolean(character.beard)
  const glasses = Boolean(character.glasses)
  const hat = Boolean(character.hat)

  const name = character.name ? String(character.name).trim() : ''

  return (
    <svg
      className={className ?? 'gw-avatar__art'}
      viewBox="0 0 120 120"
      role="img"
      aria-label={name ? `${name} avatar` : 'Character avatar'}
    >
      <BackHair offset={BACK_OFFSET[length] ?? 0} color={hairColor} />
      <Body cloth={clothColor} />
      <rect x="53" y="74" width="14" height="26" rx="7" fill={skin} />
      <Head skin={skin} />
      <Ears skin={skin} earrings={accessory === 'earrings'} />
      <HairCap style={style} color={hairColor} />
      <Eyes glasses={glasses} />
      <Mouth beard={beard} />
      {beard && <Beard color={hairColor} />}
      {accessory === 'scarf' && <Scarf color={clothColor} />}
      {accessory === 'headphones' && <Headphones />}
      {hat && <Hat />}
    </svg>
  )
}