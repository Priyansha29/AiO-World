import { initialsFor } from '../data/packs'

/**
 * A single person tile. Photos are browser-local object/data URLs, so if the
 * player skipped a photo we fall back to a clean initials avatar.
 */
function CharacterAvatar({ character }) {
  if (character.image) {
    return <img className="gw-avatar__img" src={character.image} alt="" draggable="false" />
  }
  return (
    <span className="gw-avatar__initials" aria-hidden="true">
      {initialsFor(character.name)}
    </span>
  )
}

export default function CharacterCard({
  character,
  state = 'active',
  disabled = false,
  onClick,
  actions = null,
}) {
  const classNames = ['gw-avatar', `gw-avatar--${state}`]
  if (disabled) classNames.push('gw-avatar--disabled')
  const interactive = typeof onClick === 'function' && !disabled

  const content = (
    <>
      <span className="gw-avatar__frame">
        <CharacterAvatar character={character} />
        {state === 'eliminated' && (
          <span className="gw-avatar__x" aria-hidden="true">
            ✕
          </span>
        )}
        {state === 'selected' && (
          <span className="gw-avatar__check" aria-hidden="true">
            ✓
          </span>
        )}
      </span>
      <span className="gw-avatar__name">{character.name}</span>
      {actions}
    </>
  )

  if (!interactive) {
    return (
      <div className={classNames.join(' ')} aria-disabled={disabled}>
        {content}
      </div>
    )
  }

  return (
    <button type="button" className={classNames.join(' ')} onClick={() => onClick(character)}>
      {content}
    </button>
  )
}
