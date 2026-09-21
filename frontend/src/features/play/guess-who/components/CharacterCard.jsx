import CharacterAvatar from './CharacterAvatar'

/**
 * A single person tile, rendered from their appearance attributes. Photos
 * don't exist anymore — the character is generated, and the same avatar
 * component is used everywhere so it always looks identical.
 */
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
