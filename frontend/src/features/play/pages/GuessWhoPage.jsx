/**
 * Guess Who — local, shared-screen social game.
 *
 * Two people sit at one screen (usually on a Discord / Meet call) and play on
 * the same board. The site handles characters, secret picks, turns, manual
 * elimination, question history and the final guess. Talking happens outside
 * the app. No backend, no networking, no computer player.
 */
import { useEffect, useReducer } from 'react'
import Navbar from '../../../components/Navbar'
import { FLOW, guessWhoReducer, createInitialState } from '../guess-who/logic/gameReducer'
import StartScreen from '../guess-who/components/StartScreen'
import PackSelector from '../guess-who/components/PackSelector'
import CharacterCreator from '../guess-who/components/CharacterCreator'
import PackPreview from '../guess-who/components/PackPreview'
import SecretPicker from '../guess-who/components/SecretPicker'
import GameHeader from '../guess-who/components/GameHeader'
import SecretTokens from '../guess-who/components/SecretTokens'
import QuestionPanel from '../guess-who/components/QuestionPanel'
import QuestionHistory from '../guess-who/components/QuestionHistory'
import CharacterBoard from '../guess-who/components/CharacterBoard'
import GuessDialog from '../guess-who/components/GuessDialog'
import TurnHandoff from '../guess-who/components/TurnHandoff'
import GameResult from '../guess-who/components/GameResult'
import '../play.css'
import '../guess-who/guessWho.css'

function newId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `c-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export default function GuessWhoPage() {
  const [state, dispatch] = useReducer(guessWhoReducer, undefined, createInitialState)
  const { flow, pack, turn } = state

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [flow])

  const characters = pack ? pack.characters : []
  const activeEliminated = state.eliminated[turn]
  const ownSecretId = state.secrets[turn]
  const ownSecret = characters.find((c) => c.id === ownSecretId) ?? null
  const revealed = state.result ? characters.find((c) => c.id === state.result.charId) : null
  const guessTarget = state.guess?.targetId
    ? characters.find((c) => c.id === state.guess.targetId)
    : null

  const handleBoardAction = (character) => {
    if (state.guess) dispatch({ type: 'SELECT_GUESS', id: character.id })
    else dispatch({ type: 'TOGGLE_ELIMINATE', id: character.id })
  }

  return (
    <main className="play-page gw-page" id="top">
      <Navbar />
      <div className="gw-shell">
        {flow === FLOW.start && <StartScreen onStart={() => dispatch({ type: 'START' })} />}

        {flow === FLOW.packs && (
          <PackSelector
            onSelect={(packId) => dispatch({ type: 'SELECT_PACK', packId })}
            onBack={() => dispatch({ type: 'BACK_TO_START' })}
          />
        )}

        {flow === FLOW.build && pack && (
          <CharacterCreator
            key={state.editingId ?? 'new'}
            initial={state.editingId ? characters.find((c) => c.id === state.editingId) : null}
            count={characters.length}
            editing={Boolean(state.editingId)}
            onSave={(draft) =>
              dispatch({
                type: 'SAVE_CHARACTER',
                character: { ...draft, id: state.editingId ?? newId() },
              })
            }
            onCancel={() => dispatch({ type: 'CANCEL_EDIT' })}
          />
        )}

        {flow === FLOW.preview && pack && (
          <PackPreview
            pack={pack}
            onStart={() => dispatch({ type: 'START_SECRET' })}
            onEdit={(id) => dispatch({ type: 'EDIT_CHARACTER', id })}
            onRemove={(id) => dispatch({ type: 'REMOVE_CHARACTER', id })}
            onAddMore={() => dispatch({ type: 'ADD_MORE' })}
            onNewPack={() => dispatch({ type: 'NEW_PACK', packId: pack.id })}
            onChangePack={() => dispatch({ type: 'CHANGE_PACK' })}
          />
        )}

        {flow === FLOW.secret && (
          <SecretPicker
            characters={characters}
            step={state.secretStep}
            onPick={(id) => dispatch({ type: state.secretStep === 'p1' ? 'SECRET_P1' : 'SECRET_P2', id })}
            onContinue={() => dispatch({ type: 'CONFIRM_SECRET_P1' })}
            onStart={() => dispatch({ type: 'START_GAME' })}
          />
        )}

        {flow === FLOW.play && ownSecret && (
          <>
            <GameHeader
              turn={turn}
              suspectsLeft={characters.length - activeEliminated.length}
              questionsAsked={state.history.length}
              onChangePack={() => dispatch({ type: 'CHANGE_PACK' })}
            />

            <div className="gw-layout">
              <div className="gw-main">
                <SecretTokens character={ownSecret} />

                {state.guess ? (
                  <GuessDialog
                    selected={guessTarget}
                    confirmed={state.guessConfirm}
                    onConfirm={() => dispatch({ type: 'CONFIRM_GUESS' })}
                    onFinal={() => dispatch({ type: 'FINAL_GUESS' })}
                    onKeepLooking={() => dispatch({ type: 'KEEP_LOOKING' })}
                    onCancel={() => dispatch({ type: 'KEEP_LOOKING' })}
                  />
                ) : (
                  <QuestionPanel
                    pending={state.pendingQuestion}
                    onPick={(questionId) => dispatch({ type: 'PICK_QUESTION', questionId })}
                    onAnswer={(answer) => dispatch({ type: 'RECORD_ANSWER', answer })}
                    onCancel={() => dispatch({ type: 'CANCEL_PENDING_QUESTION' })}
                  />
                )}

                <CharacterBoard
                  characters={characters}
                  mode={state.guess ? 'guess' : 'board'}
                  eliminatedIds={activeEliminated}
                  selectedId={guessTarget?.id ?? null}
                  onAction={handleBoardAction}
                />

                <p className="gw-board__hint">
                  {state.guess
                    ? 'Tap the person you want to name, then confirm.'
                    : 'Tap a person to strike them out. Strike them back in if you change your mind.'}
                </p>

                {!state.guess && (
                  <div className="gw-turnbar">
                    <button
                      type="button"
                      className="play-btn play-btn--ghost"
                      disabled={Boolean(state.pendingQuestion)}
                      onClick={() => dispatch({ type: 'START_GUESS' })}
                    >
                      Make a guess
                      <span className="play-arrow" aria-hidden="true">
                        →
                      </span>
                    </button>
                    <button
                      type="button"
                      className="play-btn play-btn--primary"
                      disabled={Boolean(state.pendingQuestion)}
                      onClick={() => dispatch({ type: 'END_TURN' })}
                    >
                      End turn
                    </button>
                  </div>
                )}
              </div>

              <aside className="gw-side">
                <QuestionHistory history={state.history} />
              </aside>
            </div>
          </>
        )}

        {flow === FLOW.handoff && (
          <TurnHandoff
            nextPlayer={state.nextTurn}
            onReady={() => dispatch({ type: 'HANDOFF_READY' })}
          />
        )}

        {flow === FLOW.result && state.result && revealed && (
          <GameResult
            result={state.result}
            revealed={revealed}
            onPlayAgain={() => dispatch({ type: 'PLAY_AGAIN' })}
            onChangePack={() => dispatch({ type: 'CHANGE_PACK' })}
          />
        )}
      </div>
    </main>
  )
}
