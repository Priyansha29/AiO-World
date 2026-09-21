import CharacterCreator from './CharacterCreator'
import PackRoster from './PackRoster'

function PackScreen({
  pack,
  characters,
  editingId,
  notice,
  onSave,
  onCancelEdit,
  onEdit,
  onRemove,
  onNewPack,
  onChangePack,
  onStart,
}) {
  const count = characters.length
  const full = count === 12
  const editing = editingId ? characters.find((c) => c.id === editingId) ?? null : null

  return (
    <section className="gw-step">
      <header className="gw-step__head">
        <p className="play-eyebrow">
          <span className="play-eyebrow__dot" aria-hidden="true" />
          {pack.emoji} {pack.title}
        </p>
        <h1 className="gw-step__title">Your {pack.title} Pack</h1>
        <p className="gw-step__desc">
          {count} / 12 people added
          {full ? ' — your pack is ready.' : ' — add people you all know.'}
        </p>
      </header>

      {notice && (
        <p className="gw-notice" role="status">
          ✓ {notice}
        </p>
      )}

      {editing ? (
        <CharacterCreator
          key={editing.id}
          initial={editing}
          count={count}
          existing={characters}
          onSave={onSave}
          onCancel={onCancelEdit}
        />
      ) : full ? (
        <div className="gw-ready">
          <p className="gw-ready__title">Your pack is ready.</p>
          <p className="gw-ready__sub">Everyone locked in. Time to play.</p>
          <button type="button" className="play-btn play-btn--primary play-btn--big" onClick={onStart}>
            Start Guess Who
            <span className="play-arrow" aria-hidden="true">
              →
            </span>
          </button>
        </div>
      ) : (
        <CharacterCreator
          key="new"
          initial={null}
          count={count}
          existing={characters}
          onSave={onSave}
          onCancel={onCancelEdit}
        />
      )}

      {count > 0 && (
        <div className="gw-roster-wrap">
          <h2 className="gw-roster-title">In this pack</h2>
          <PackRoster characters={characters} onEdit={onEdit} onRemove={onRemove} />
        </div>
      )}

      <div className="gw-step__foot gw-step__foot--spread">
        <button type="button" className="gw-textbtn" onClick={onNewPack}>
          Build a new pack
        </button>
        <button type="button" className="gw-textbtn" onClick={onChangePack}>
          Change pack
        </button>
      </div>
    </section>
  )
}

export default PackScreen
