/**
 * GameMotif — small original abstract illustrations for each game card.
 * Simple inline SVG, tinted via the card's accent (`--motif` custom property).
 */
import React from 'react'

function SongMotif() {
  return (
    <svg viewBox="0 0 140 64" fill="none" aria-hidden="true">
      <rect className="gp-bar" x="16" y="22" width="10" height="42" rx="5" />
      <rect className="gp-bar gp-bar--a" x="38" y="8" width="10" height="56" rx="5" />
      <rect className="gp-bar" x="60" y="30" width="10" height="34" rx="5" />
      <rect className="gp-bar" x="82" y="2" width="10" height="62" rx="5" />
      <rect className="gp-bar" x="104" y="18" width="10" height="46" rx="5" />
    </svg>
  )
}

function FriendsMotif() {
  return (
    <svg viewBox="0 0 140 64" fill="none" aria-hidden="true">
      <circle className="gp-ring" cx="46" cy="36" r="21" />
      <circle className="gp-ring gp-ring--a" cx="86" cy="42" r="21" />
      <circle className="gp-badge" cx="70" cy="29" r="13" />
      <text x="70" y="34" textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff">
        ?
      </text>
    </svg>
  )
}

function TimerMotif() {
  return (
    <svg viewBox="0 0 140 64" fill="none" aria-hidden="true">
      <circle className="gp-tick" cx="68" cy="38" r="27" />
      <rect className="gp-crown" x="64" y="6" width="8" height="10" rx="3" />
      <circle className="gp-rim" cx="68" cy="38" r="20" />
      <path className="gp-hand" d="M68 38 L75 27" />
      <circle className="gp-knob" cx="68" cy="38" r="4" />
    </svg>
  )
}

function FlagMotif() {
  const patternId = React.useId()
  return (
    <svg viewBox="0 0 140 64" fill="none" aria-hidden="true">
      <defs>
        <pattern id={patternId} width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" className="gp-check--bg" />
          <path d="M0 0h5v5H0zM5 5h5v5H5z" className="gp-check--fg" />
        </pattern>
      </defs>
      <g className="gp-flag">
        <rect x="22" y="12" width="38" height="30" fill={`url(#${patternId})`} />
        <rect x="19" y="44" width="4.5" height="14" rx="2" className="gp-pole" />
        <path className="gp-speed gp-speed--l" d="M70 26 H106" />
        <path className="gp-speed" d="M78 38 H106" />
        <path className="gp-speed gp-speed--s" d="M86 50 H106" />
      </g>
    </svg>
  )
}

function GameMotif({ type }) {
  switch (type) {
    case 'song':
      return <SongMotif />
    case 'friends':
      return <FriendsMotif />
    case 'timer':
      return <TimerMotif />
    case 'flag':
      return <FlagMotif />
    default:
      return null
  }
}

export default GameMotif