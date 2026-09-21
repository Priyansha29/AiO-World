import { useState } from 'react'
import CharacterAvatar from './CharacterAvatar'
import {
  ACCESSORIES,
  CLOTHING_COLORS,
  GENDERS,
  HAIRS,
  HAIR_LENGTHS,
  HAIR_STYLES,
  SKIN_TONES,
  emptyCharacterDraft,
} from '../data/packs'

const GENDER_LABELS = { male: 'Male', female: 'Female', other: 'Other' }
const HAIR_LABELS = { black: 'Black', brown: 'Brown', blonde: 'Blonde', red: 'Red' }
const LENGTH_LABELS = { short: 'Short', medium: 'Medium', long: 'Long' }
const SKIN_LABELS = { light: 'Light', medium: 'Medium', dark: 'Dark' }
const STYLE_LABELS = { straight: 'Straight', wavy: 'Wavy', curly: 'Curly', bangs: 'Bangs', bob: 'Bob' }
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

// Swatch colors mirror the avatar palette so what you pick is what you get.
const SKIN_SWATCHES = { light: '#FFD9B3', medium: '#D99A6C', dark: '#8B5A32' }
const CLOTH_SWATCHES = {
  red: '#E2574C',
  blue: '#4C78C4',
  green: '#4C9A6B',
  yellow: '#E8C25C',
  purple: '#8B5DB0',
  black: '#31353C',
  white: '#F7F7F9',
}

function normalizeName(name) {
  return String(name ?? '').trim().toLowerCase()
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
            {labels[option] ?? option}
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

function HairColorPills({ value, onChange }) {
  return (
    <div className="gw-field">
      <span className="gw-field__label">Hair color</span>
      <div className="gw-seg" role="group" aria-label="Hair color">
        {HAIRS.map((option) => {
          const active = value === option
          return (
            <button
              key={option}
              type="button"
              className={`gw-pill gw-pill--hair${active ? ' is-active' : ''}`}
              aria-pressed={active}
              aria-label={`${HAIR_LABELS[option]} hair`}
              onClick={() => onChange(option)}
            >
              <span className="gw-pill__dot" style={{ background: HAIR_SWATCHES[option] }} />
              {HAIR_LABELS[option]}
              {active && (
                <span className="gw-pill__check" aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function HairStyleField({ value, onChange }) {
  return (
    <div className="gw-field">
      <span className="gw-field__label">Hair style</span>
      <div className="gw-styles" role="group" aria-label="Hair style">
        {HAIR_STYLES.map((style) => {
          const active = value === style
          return (
            <button
              key={style}
              type="button"
              className={`gw-style${active ? ' is-active' : ''}`}
              aria-pressed={active}
              onClick={() => onChange(style)}
            >
              <HairStyleThumb style={style} />
              <span className="gw-style__label">{STYLE_LABELS[style]}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function HairStyleThumb({ style }) {
  const face = <circle cx="20" cy="23" r="10" fill="#F2D4B8" />
  let extra = null
  if (style === 'straight') {
    extra = <path d="M 10 25 A 10 10 0 0 1 30 25 L 30 20 L 10 20 Z" fill="#2C2A32" />
  }
  if (style === 'bangs') {
    extra = (
      <g fill="#2C2A32">
        <path d="M 10 25 A 10 10 0 0 1 30 25 L 30 20 L 10 20 Z" />
        <rect x="10" y="15" width="20" height="8" rx="2.5" />
      </g>
    )
  }
  if (style === 'wavy') {
    extra = <path d="M 10 25 A 10 10 0 0 1 30 25 L 30 19 Q 25 16 20 19 Q 15 16 10 19 Z" fill="#2C2A32" />
  }
  if (style === 'curly') {
    extra = (
      <g fill="#2C2A32">
        <circle cx="16" cy="17" r="5.5" />
        <circle cx="21" cy="14" r="6.5" />
        <circle cx="26" cy="17" r="5.5" />
        <path d="M 12 24 Q 20 21 28 24 L 28 20 L 12 20 Z" />
      </g>
    )
  }
  if (style === 'bob') {
    extra = <path d="M 10 25 A 10 10 0 0 1 30 25 C 30 30 27 31 25 31 L 15 31 C 13 31 10 30 10 25 Z" fill="#2C2A32" />
  }
  return (
    <svg className="gw-style__art" viewBox="0 0 40 40" aria-hidden="true">
      {face}
      {extra}
    </svg>
  )
}

function Swatches({ label, value, options, colorMap, nameFor, onChange }) {
  return (
    <div className="gw-field">
      <span className="gw-field__label">{label}</span>
      <div className="gw-swatches" role="group" aria-label={label}>
        {options.map((option) => {
          const active = value === option
          return (
            <button
              key={option}
              type="button"
              className={`gw-swatch${active ? ' is-active' : ''}`}
              aria-pressed={active}
              aria-label={nameFor(option)}
              onClick={() => onChange(option)}
            >
              <span className="gw-swatch__dot" style={{ background: colorMap[option] }} />
              <span className="gw-swatch__label">{nameFor(option)}</span>
              <span className="gw-swatch__check" aria-hidden="true">
                ✓
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

const HAIR_SWATCHES = { black: '#2C2A32', brown: '#7B4A2B', blonde: '#E8C466', red: '#B8503C' }

function CharacterCreator({ initial, count, existing = [], onSave, onCancel }) {
  const [draft, setDraft] = useState(() => ({ ...emptyCharacterDraft(), ...(initial ?? {}) }))
  const [error, setError] = useState('')

  const editing = Boolean(initial)
  const atLimit = !editing && count >= 12

  const set = (patch) => setDraft((prev) => ({ ...prev, ...patch }))

  const reset = () => {
    setDraft({ ...emptyCharacterDraft(), ...(initial ?? {}) })
    setError('')
  }

  const submit = (event) => {
    event.preventDefault()
    const name = draft.name.trim()

    if (!name) {
      setError('Enter a name.')
      return
    }
    const clash = existing.some(
      (person) => person.id !== initial?.id && normalizeName(person.name) === normalizeName(name),
    )
    if (clash) {
      setError('This person is already in your pack.')
      return
    }
    if (atLimit) {
      setError('Your pack is full. Remove someone first.')
      return
    }

    setError('')
    onSave({ ...draft, name })
    // Ready the form for the next person.
    setDraft(emptyCharacterDraft())
  }

  const displayName = draft.name.trim() || 'Your person'

  return (
    <form className="gw-create" onSubmit={submit}>
      <div className="gw-create__form">
        <label className="gw-field">
          <span className="gw-field__label">Name</span>
          <input
            className="gw-input"
            type="text"
            value={draft.name}
            maxLength={40}
            placeholder="e.g. Priyansha"
            onChange={(event) => {
              set({ name: event.target.value })
              if (error) setError('')
            }}
          />
        </label>

        <Segmented label="Gender" value={draft.gender} options={GENDERS} labels={GENDER_LABELS} onChange={(v) => set({ gender: v })} />

        <Swatches
          label="Skin tone"
          value={draft.skinTone}
          options={SKIN_TONES}
          colorMap={SKIN_SWATCHES}
          nameFor={(o) => `${SKIN_LABELS[o]} skin tone`}
          onChange={(v) => set({ skinTone: v })}
        />

        <HairColorPills value={draft.hair} onChange={(v) => set({ hair: v })} />

        <Segmented label="Hair length" value={draft.hairLength} options={HAIR_LENGTHS} labels={LENGTH_LABELS} onChange={(v) => set({ hairLength: v })} />

        <HairStyleField value={draft.hairStyle} onChange={(v) => set({ hairStyle: v })} />

        <div className="gw-create__pairs">
          <BoolField label="Glasses" value={draft.glasses} onChange={(v) => set({ glasses: v })} />
          <BoolField label="Beard" value={draft.beard} onChange={(v) => set({ beard: v })} />
        </div>
        <div className="gw-create__pairs">
          <BoolField label="Hat" value={draft.hat} onChange={(v) => set({ hat: v })} />
        </div>

        <Swatches
          label="Clothing color"
          value={draft.clothing}
          options={CLOTHING_COLORS}
          colorMap={CLOTH_SWATCHES}
          nameFor={(o) => `${CLOTHING_LABELS[o]} clothing`}
          onChange={(v) => set({ clothing: v })}
        />

        <Segmented label="Accessory" value={draft.accessory} options={ACCESSORIES} labels={ACCESSORY_LABELS} onChange={(v) => set({ accessory: v })} />

        {error && (
          <p className="gw-form-error" role="alert">
            {error}
          </p>
        )}

        <div className="gw-create__actions">
          <button type="button" className="play-btn play-btn--ghost" onClick={reset}>
            Reset
          </button>
          <button type="submit" className="play-btn play-btn--primary" disabled={atLimit}>
            {editing ? 'Save changes' : '+ Add person'}
          </button>
          {editing && (
            <button type="button" className="play-btn play-btn--ghost" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </div>

      <aside className="gw-create__preview">
        <h3 className="gw-field__label">Preview</h3>
        <p className="gw-hint">This is how they&rsquo;ll look in the game.</p>
        <div className="gw-preview">
          <div className="gw-preview__art">
            <CharacterAvatar character={draft} />
          </div>
          <span className="gw-preview__name">{displayName}</span>
        </div>
      </aside>
    </form>
  )
}

export default CharacterCreator