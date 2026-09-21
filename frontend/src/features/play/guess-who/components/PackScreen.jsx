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
      <header className="gw-step__head gw-step__head--spread">
        <div>
          <p className="play-eyebrow">
            <span className="play-eyebrow__dot" aria-hidden="true" />
            {pack.emoji} {pack.title}
          </p>
          <h1 className="gw-step__title">Create a person</h1>
          <p className="gw-step__desc">
            Add the people you want to play with. Design their look using the options below.
          </p>
        </div>
        <span className="gw-counter" aria-live="polite">
          <strong>{count} / 12</strong> people added
        </span>
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
          <span className="gw-ready__check" aria-hidden="true">
            ✓
          </span>
          <p className="gw-ready__title">Your pack is ready.</p>
          <p className="gw-ready__sub">Everyone locked in. Time to play.</p>
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

      <section className="gw-roster-wrap" aria-label="Your College pack">
        <div className="gw-roster-head">
          <h2 className="gw-roster-title">Your College pack</h2>
          <span className="gw-roster-count">
            {count} / 12 people added
          </span>
        </div>

        {count > 0 ? (
          <PackRoster characters={characters} onEdit={onEdit} onRemove={onRemove} />
        ) : (
          <p className="gw-roster-empty">No people yet — add your first person above.</p>
        )}

        <div className="gw-roster-cta">
          <button
            type="button"
            className="play-btn play-btn--primary play-btn--big"
            disabled={!full}
            onClick={onStart}
          >
            Start Guess Who
            <span className="play-arrow" aria-hidden="true">
              →
            </span>
          </button>
          <p className="gw-hint">
            {full ? 'Everyone is ready to play.' : `Add ${12 - count} more ${12 - count === 1 ? 'person' : 'people'} to continue.`}
          </p>
        </div>
      </section>

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