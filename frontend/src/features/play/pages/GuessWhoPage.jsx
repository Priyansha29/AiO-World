/**
 * Guess Who — a digital board game for two people on one screen, talked
 * through over Discord.
 *
 * The browser only ever shows public things: the pack, the shared board and
 * who's turn it is. Secret choices, questions and answers all happen out
 * loud between the players, because a shared screen can't hide anything from
 * anyone. No backend, no networking, no computer.
 */
import { useEffect, useReducer } from 'react'
import Navbar from '../../../components/Navbar'
import { FLOW, guessWhoReducer, createInitialState } from '../guess-who/logic/gameReducer'
import StartScreen from '../guess-who/components/StartScreen'
import PackSelector from '../guess-who/components/PackSelector'
import PackScreen from '../guess-who/components/PackScreen'
import ReadyScreen from '../guess-who/components/ReadyScreen'
import GameHeader from '../guess-who/components/GameHeader'
import CharacterBoard from '../guess-who/components/CharacterBoard'
import GuessDialog from '../guess-who/components/GuessDialog'
import TurnHandoff from '../guess-who/components/TurnHandoff'
import SettleScreen from '../guess-who/components/SettleScreen'
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
  const guessTarget = state.guess?.targetId
    ? characters.find((c) => c.id === state.guess.targetId)
    : null

  const handleBoardAction = (character) => {
    if (flow === FLOW.guess) dispatch({ type: 'SELECT_GUESS', id: character.id })
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
          <PackScreen
            pack={pack}
            characters={characters}
            editingId={state.editingId}
            notice={state.notice}
            onSave={(draft) =>
              dispatch({
                type: 'SAVE_CHARACTER',
                character: { ...draft, id: state.editingId ?? newId() },
              })
            }
            onCancelEdit={() => dispatch({ type: 'CANCEL_EDIT' })}
            onEdit={(id) => dispatch({ type: 'EDIT_CHARACTER', id })}
            onRemove={(id) => dispatch({ type: 'REMOVE_CHARACTER', id })}
            onNewPack={() => dispatch({ type: 'NEW_PACK', packId: pack.id })}
            onChangePack={() => dispatch({ type: 'CHANGE_PACK' })}
            onStart={() => dispatch({ type: 'START_READY' })}
          />
        )}

        {flow === FLOW.ready && (
          <ReadyScreen onStart={() => dispatch({ type: 'READY_START' })} />
        )}

        {flow === FLOW.play && (
          <>
            <GameHeader
              suspects={characters.length - activeEliminated.length}
              onChangePack={() => dispatch({ type: 'CHANGE_PACK' })}
            />

            <CharacterBoard
              characters={characters}
              mode="board"
              eliminatedIds={activeEliminated}
              onAction={handleBoardAction}
            />

            <p className="gw-board__hint">Tap people to eliminate or restore them.</p>

            <div className="gw-turnbar">
              <button
                type="button"
                className="play-btn play-btn--ghost"
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
                onClick={() => dispatch({ type: 'END_TURN' })}
              >
                End turn
              </button>
            </div>
          </>
        )}

        {flow === FLOW.guess && (
          <>
            <GuessDialog
              selected={guessTarget}
              onConfirm={() => dispatch({ type: 'CONFIRM_GUESS' })}
              onCancel={() => dispatch({ type: 'CANCEL_GUESS' })}
            />

            <CharacterBoard
              characters={characters}
              mode="guess"
              selectedId={guessTarget?.id ?? null}
              onAction={handleBoardAction}
            />

            <p className="gw-board__hint">Tap the person you want to name, then confirm.</p>
          </>
        )}

        {flow === FLOW.settle && (
          <SettleScreen
            guessName={guessTarget?.name ?? null}
            onWon={() => dispatch({ type: 'DECLARE_WON' })}
            onLost={() => dispatch({ type: 'DECLARE_LOST' })}
          />
        )}

        {flow === FLOW.handoff && <TurnHandoff onReady={() => dispatch({ type: 'HANDOFF_READY' })} />}

        {flow === FLOW.end && state.result && (
          <GameResult
            result={state.result}
            onPlayAgain={() => dispatch({ type: 'PLAY_AGAIN' })}
            onChangePack={() => dispatch({ type: 'CHANGE_PACK' })}
          />
        )}
      </div>
    </main>
  )
}