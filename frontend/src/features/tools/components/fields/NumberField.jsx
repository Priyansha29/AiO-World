function NumberField({ id, label, value, onChange, error, suffix, hint, min, step, placeholder }) {
  return (
    <div className="tool-field">
      <label className="tool-field__label" htmlFor={id}>
        {label}
      </label>
      <span
        className={`tool-field__control${error ? ' tool-field__control--invalid' : ''}`}
      >
        <input
          id={id}
          className="tool-input"
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          placeholder={placeholder}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
        {suffix && <span className="tool-field__suffix">{suffix}</span>}
      </span>
      {hint && <span className="tool-field__hint">{hint}</span>}
      {error && (
        <span id={`${id}-error`} className="tool-field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}

export default NumberField