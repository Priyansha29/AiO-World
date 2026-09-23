import { useEffect, useState } from 'react'
import Navbar from '../../../components/Navbar'
import { NANNY_MANIA_STREAM_URL } from '../nanny-mania/config'
import '../play.css'
import '../nanny-mania/nannyMania.css'

const LOAD_TIMEOUT_MS = 10000

async function probeStream() {
  try {
    await fetch(NANNY_MANIA_STREAM_URL, { mode: 'no-cors' })
    return true
  } catch {
    return false
  }
}

export default function NannyManiaPage() {
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'offline'
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  useEffect(() => {
    let alive = true

    probeStream().then((reachable) => {
      if (!alive) return
      setStatus(reachable ? 'loading' : 'offline')
    })

    return () => {
      alive = false
    }
  }, [attempt])

  useEffect(() => {
    if (status !== 'loading') return undefined
    const timer = window.setTimeout(() => setStatus('offline'), LOAD_TIMEOUT_MS)
    return () => window.clearTimeout(timer)
  }, [status, attempt])

  return (
    <main className="play-page nanny-page" id="top">
      <Navbar />
      <div className="nanny-shell">
        <header className="nanny-top">
          <a className="play-back nanny-back" href="#/play">
            <span className="play-back__arrow" aria-hidden="true">
              ←
            </span>
            Back to Play
          </a>
          <h1 className="nanny-top__title">Nanny Mania</h1>
        </header>

        <div className="nanny-stage">
          {status !== 'offline' && (
            <iframe
              className="nanny-frame"
              src={NANNY_MANIA_STREAM_URL}
              title="Nanny Mania"
              allow="fullscreen"
              allowFullScreen
              onLoad={() => setStatus('ready')}
            />
          )}

          {status === 'loading' && (
            <div className="nanny-state" role="status" aria-live="polite">
              <span className="nanny-spinner" aria-hidden="true" />
              <p>Starting the Nanny Mania stream…</p>
              <p className="nanny-state__hint">
                Keep the local stack running on <code>localhost:6080</code>.
              </p>
            </div>
          )}

          {status === 'offline' && (
            <div className="nanny-state nanny-state--error" role="alert">
              <p className="nanny-state__title">Can&rsquo;t reach the Nanny Mania stream</p>
              <p className="nanny-state__hint">
                Start the local streaming stack, then retry. See{" "}
                <code>frontend/src/features/play/nanny-mania/README.md</code>.
              </p>
              <button
                type="button"
                className="play-btn play-btn--primary"
                onClick={() => {
                  setStatus('loading')
                  setAttempt((n) => n + 1)
                }}
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}