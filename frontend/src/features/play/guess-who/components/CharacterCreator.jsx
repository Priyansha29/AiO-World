import { useRef, useState } from 'react'
import {
  ACCESSORIES,
  CLOTHING_COLORS,
  GENDERS,
  HAIRS,
  HAIR_LENGTHS,
  SKIN_TONES,
  emptyCharacterDraft,
  initialsFor,
} from '../data/packs'

const GENDER_LABELS = { male: 'Male', female: 'Female', other: 'Other' }
const HAIR_LABELS = { black: 'Black', brown: 'Brown', blonde: 'Blonde', red: 'Red' }
const LENGTH_LABELS = { short: 'Short', medium: 'Medium', long: 'Long' }
const SKIN_LABELS = { light: 'Light', medium: 'Medium', dark: 'Dark' }
const CLOTHING_LABELS = {
  red: 'Red',
  blue: 'Blue',
  green: 'Green',
  yellow: 'Yellow',
  purple: 'Purple',
  black: 'Black',
  white: 'White',
}
const ACCESSORY_LABELS = {
  none: 'None',
  earrings: 'Earrings',
  scarf: 'Scarf',
  headphones: 'Headphones',
}

function titleCase(option, labels) {
  return labels[option] ?? option
}

function Segmented({ label, value, options, labels, onChange }) {
  return (
    <div className="gw-field">
      <span className="gw-field__label">{label}</span>
      <div className="gw-seg" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`gw-seg__btn${value === option ? ' is-active' : ''}`}
            aria-pressed={value === option}
            onClick={() => onChange(option)}
          >
            {titleCase(option, labels)}
          </button>
        ))}
      </div>
    </div>
  )
}

function BoolField({ label, value, onChange }) {
  return (
    <Segmented
      label={label}
      value={value ? 'yes' : 'no'}
      options={['yes', 'no']}
      labels={{ yes: 'Yes', no: 'No' }}
      onChange={(next) => onChange(next === 'yes')}
    />
  )
}

function CharacterCreator({ initial, count, editing, onSave, onCancel }) {
  const [draft, setDraft] = useState(() => ({ ...emptyCharacterDraft(), ...(initial ?? {}) }))
  const fileRef = useRef(null)

  const set = (patch) => setDraft((prev) => ({ ...prev, ...patch }))

  const handlePhoto = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => set({ image: String(reader.result) })
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const nameOk = draft.name.trim().length > 0
  const canSave = nameOk && (editing || count < 12)

  const submit = (event) => {
    event.preventDefault()
    if (!canSave) return
    onSave(draft)
  }

  return (
    <form className="gw-creator gw-panel" onSubmit={submit}>
      <div className="gw-creator__head">
        <div>
          <h2 className="gw-creator__title">{editing ? 'Edit character' : 'Add character'}</h2>
          <p className="gw-creator__count">
            Characters added: <strong>{count} / 12</strong>
          </p>
        </div>
        {!editing && (
          <span className="gw-creator__badge">
            {count >= 12 ? 'Pack full' : `${12 - count} to go`}
          </span>
        )}
      </div>

      <label className="gw-field">
        <span className="gw-field__label">Name</span>
        <input
          className="gw-input"
          type="text"
          value={draft.name}
          maxLength={40}
          placeholder="e.g. Aarav Sharma"
          onChange={(event) => set({ name: event.target.value })}
        />
      </label>

      <div className="gw-field">
        <span className="gw-field__label">Photo</span>
        <div className="gw-photo-row">
          <span className="gw-photo-preview">
            {draft.image ? (
              <img src={draft.image} alt="" />
            ) : (
              <span className="gw-photo-preview__initials">{initialsFor(draft.name)}</span>
            )}
          </span>
          <div className="gw-photo-actions">
            <button type="button" className="play-btn play-btn--ghost" onClick={() => fileRef.current?.click()}>
              {draft.image ? 'Change photo' : 'Choose photo'}
            </button>
            {draft.image && (
              <button type="button" className="gw-textbtn" onClick={() => set({ image: '' })}>
                Remove
              </button>
            )}
            <input
              ref={fileRef}
              className="gw-visually-hidden"
              type="file"
              accept="image/*"
              onChange={handlePhoto}
            />
          </div>
        </div>
        <p className="gw-hint">Photos stay in this browser session for this prototype.</p>
      </div>

      <div className="gw-creator__grid">
        <Segmented label="Gender" value={draft.gender} options={GENDERS} labels={GENDER_LABELS} onChange={(v) => set({ gender: v })} />
        <Segmented label="Hair" value={draft.hair} options={HAIRS} labels={HAIR_LABELS} onChange={(v) => set({ hair: v })} />
        <Segmented label="Hair length" value={draft.hairLength} options={HAIR_LENGTHS} labels={LENGTH_LABELS} onChange={(v) => set({ hairLength: v })} />
        <Segmented label="Skin tone" value={draft.skinTone} options={SKIN_TONES} labels={SKIN_LABELS} onChange={(v) => set({ skinTone: v })} />
        <Segmented label="Clothing" value={draft.clothing} options={CLOTHING_COLORS} labels={CLOTHING_LABELS} onChange={(v) => set({ clothing: v })} />
        <Segmented label="Accessory" value={draft.accessory} options={ACCESSORIES} labels={ACCESSORY_LABELS} onChange={(v) => set({ accessory: v })} />
        <BoolField label="Glasses" value={draft.glasses} onChange={(v) => set({ glasses: v })} />
        <BoolField label="Beard" value={draft.beard} onChange={(v) => set({ beard: v })} />
        <BoolField label="Hat" value={draft.hat} onChange={(v) => set({ hat: v })} />
      </div>

      <div className="gw-creator__actions">
        <button type="submit" className="play-btn play-btn--primary" disabled={!canSave}>
          {editing ? 'Save changes' : 'Add character'}
        </button>
        <button type="button" className="play-btn play-btn--ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default CharacterCreator
