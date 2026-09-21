import { useState } from 'react'

function GuessDialog({ selected, onConfirm, onCancel }) {
  const [step, setStep] = useState('pick')

  if (step === 'confirm') {
    return (
      <section className="gw-panel gw-guess" role="alertdialog" aria-labelledby="gw-sure-title">
        <h2 id="gw-sure-title" className="gw-guess__title">Is this your final guess?</h2>
        <p className="gw-guess__sub">
          You think it&rsquo;s <strong>{selected ? selected.name : 'them'}</strong>.
        </p>
        <div className="gw-guess__actions">
          <button type="button" className="play-btn play-btn--primary" onClick={onConfirm}>
            Confirm
          </button>
          <button type="button" className="play-btn play-btn--ghost" onClick={() => setStep('pick')}>
            Keep looking
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="gw-panel gw-guess" aria-labelledby="gw-guess-title">
      <h2 id="gw-guess-title" className="gw-guess__title">Who do you think it is?</h2>
      <p className="gw-guess__sub">
        {selected ? `Selected: ${selected.name}` : 'Tap a character on the board to choose them.'}
      </p>
      <div className="gw-guess__actions">
        <button type="button" className="play-btn play-btn--primary" disabled={!selected} onClick={() => setStep('confirm')}>
          Confirm final guess
        </button>
        <button type="button" className="play-btn play-btn--ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </section>
  )
}

export default GuessDialog