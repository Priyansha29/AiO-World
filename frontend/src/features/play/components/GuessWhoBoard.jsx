/**
 * GuessWhoBoard — an ORIGINAL, abstract Guess Who board preview built from
 * CSS avatars (colored circles, simple faces, "flipped" tiles). No licensed
 * character artwork anywhere. Purely decorative: rendered with aria-hidden.
 */
import React from 'react'

const AVATAR_COLORS = ['#ff5350', '#ff8383', '#ffc193', '#e6b26e', '#ff9a6b', '#ef6f6f']
const MOUTHS = ['smile', 'o', 'line']

const AVATARS = Array.from({ length: 12 }, (_, i) => ({
  id: `aw-${i}`,
  color: AVATAR_COLORS[i % AVATAR_COLORS.length],
  mouth: MOUTHS[(i * 2 + 1) % MOUTHS.length],
  flipped: i === 3 || i === 8,
}))

function Face({ mouth }) {
  return (
    <span className="gw-face">
      <span className="gw-eyes">
        <span className="gw-eye" />
        <span className="gw-eye" />
      </span>
      <span className={`gw-mouth--${mouth}`} />
    </span>
  )
}

function GuessWhoBoard({ label = 'Pick a face' }) {
  return (
    <div className="gw-board" aria-hidden="true">
      <div className="gw-board__bar">
        <span>{label}</span>
        <span>{AVATARS.length} suspects</span>
      </div>
      <div className="gw-board__grid">
        {AVATARS.map((avatar) => (
          <span
            key={avatar.id}
            className={`gw-avatar${avatar.flipped ? ' gw-avatar--flipped' : ''}`}
            style={{ '--gw-color': avatar.color }}
          >
            {avatar.flipped ? (
              <span className="gw-avatar__x" />
            ) : (
              <Face mouth={avatar.mouth} />
            )}
          </span>
        ))}
      </div>
    </div>
  )
}

export default GuessWhoBoard