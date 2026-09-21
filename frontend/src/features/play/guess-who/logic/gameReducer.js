/**
 * Guess Who — game state machine (pure).
 *
 * Drives one shared screen: building a College pack, the pass-the-screen
 * secret picks, alternating human turns, manual elimination and the final
 * guess.
 *
 * There is deliberately no computer player, no networking and no automatic
 * answering/elimination. Two people share one screen and talk over Discord,
 * so the only identities are "the current player" and "the other player".
 */
import { createPack, getPack, toCharacter, CHARACTER_LIMIT } from '../data/packs.js'

export const FLOW = {
  start: 'start',
  packs: 'packs',
  build: 'build',
  secret: 'secret',
  play: 'play',
  handoff: 'handoff',
  result: 'result',
}

/** Internal turn slots. Never shown to the players as "Player 1/2". */
export const TURN = { A: 'A', B: 'B' }

export function otherTurn(turn) {
  return turn === TURN.A ? TURN.B : TURN.A
}

export function createInitialState() {
  return {
    flow: FLOW.start,
    pack: null,
    editingId: null,
    notice: null,
    secretStep: 'a', // a -> locked-a -> pass -> b -> both
    secrets: { A: null, B: null },
    turn: TURN.A,
    nextTurn: TURN.B,
    eliminated: { A: [], B: [] },
    pendingQuestion: null,
    history: [],
    guess: null,
    guessConfirm: false,
    result: null,
  }
}

function freshMatch() {
  return {
    secrets: { A: null, B: null },
    turn: TURN.A,
    nextTurn: TURN.B,
    eliminated: { A: [], B: [] },
    pendingQuestion: null,
    history: [],
    guess: null,
    guessConfirm: false,
    result: null,
  }
}

function replaceCharacter(characters, character) {
  return characters.map((c) => (c.id === character.id ? character : c))
}

export function guessWhoReducer(state, action) {
  switch (action.type) {
    // Pack selection / building ------------------------------------------
    case 'START':
      return { ...state, flow: FLOW.packs }

    case 'SELECT_PACK': {
      const meta = getPack(action.packId)
      if (!meta || meta.status !== 'available') return state
      const keepExisting = state.pack && state.pack.id === meta.id
      return {
        ...state,
        pack: keepExisting ? state.pack : createPack(meta),
        flow: FLOW.build,
        editingId: null,
        notice: null,
      }
    }

    case 'BACK_TO_PACKS':
      return { ...state, flow: FLOW.packs, editingId: null, notice: null }

    case 'BACK_TO_START':
      return { ...state, flow: FLOW.start }

    case 'NEW_PACK': {
      const meta = getPack(action.packId)
      if (!meta) return state
      return { ...state, pack: createPack(meta), flow: FLOW.build, editingId: null, notice: null, ...freshMatch() }
    }

    case 'EDIT_CHARACTER':
      return { ...state, editingId: action.id, notice: null }

    case 'CANCEL_EDIT':
      return { ...state, editingId: null, notice: null }

    case 'SAVE_CHARACTER': {
      if (!state.pack) return state
      const character = toCharacter(action.character, action.character.id || action.id)
      const isEdit = Boolean(state.editingId)
      let characters
      let notice
      if (isEdit) {
        characters = replaceCharacter(state.pack.characters, { ...character, id: state.editingId })
        notice = `${character.name} updated`
      } else {
        if (state.pack.characters.length >= CHARACTER_LIMIT) return state
        characters = [...state.pack.characters, character]
        notice = `${character.name} added`
      }
      return { ...state, pack: { ...state.pack, characters }, editingId: null, notice, flow: FLOW.build }
    }

    case 'REMOVE_CHARACTER': {
      if (!state.pack) return state
      const characters = state.pack.characters.filter((c) => c.id !== action.id)
      return {
        ...state,
        pack: { ...state.pack, characters },
        editingId: state.editingId === action.id ? null : state.editingId,
        notice: null,
      }
    }

    case 'DISMISS_NOTICE':
      return { ...state, notice: null }

    // Privacy hand-off: secret character picks ---------------------------
    case 'START_SECRET': {
      if (!state.pack || state.pack.characters.length !== CHARACTER_LIMIT) return state
      return { ...state, flow: FLOW.secret, secretStep: 'a', notice: null, ...freshMatch() }
    }

    case 'SECRET_A': {
      if (state.secretStep !== 'a') return state
      return { ...state, secrets: { ...state.secrets, A: action.id }, secretStep: 'locked-a' }
    }

    case 'CONFIRM_SECRET_A':
      return state.secretStep === 'locked-a' ? { ...state, secretStep: 'pass' } : state

    case 'SECRET_PASS_READY':
      return state.secretStep === 'pass' ? { ...state, secretStep: 'b' } : state

    case 'SECRET_B': {
      if (state.secretStep !== 'b') return state
      return { ...state, secrets: { ...state.secrets, B: action.id }, secretStep: 'both' }
    }

    case 'START_GAME':
      if (state.secretStep !== 'both') return state
      return { ...state, flow: FLOW.play, ...freshMatch(), secrets: state.secrets }

    // Current player's turn ----------------------------------------------
    case 'PICK_QUESTION':
      if (state.flow !== FLOW.play || state.pendingQuestion || state.guess) return state
      return { ...state, pendingQuestion: action.questionId }

    case 'CANCEL_PENDING_QUESTION':
      return { ...state, pendingQuestion: null }

    case 'RECORD_ANSWER': {
      if (!state.pendingQuestion) return state
      const entry = {
        id: `q-${state.history.length}-${state.pendingQuestion}`,
        questionId: state.pendingQuestion,
        answer: Boolean(action.answer),
      }
      return { ...state, history: [...state.history, entry], pendingQuestion: null }
    }

    case 'TOGGLE_ELIMINATE': {
      if (state.flow !== FLOW.play || state.guess) return state
      const current = state.eliminated[state.turn]
      const next = current.includes(action.id)
        ? current.filter((id) => id !== action.id)
        : [...current, action.id]
      return { ...state, eliminated: { ...state.eliminated, [state.turn]: next } }
    }

    // Final guess --------------------------------------------------------
    case 'START_GUESS':
      if (state.flow !== FLOW.play || state.guess) return state
      return { ...state, guess: { targetId: null }, guessConfirm: false }

    case 'SELECT_GUESS':
      if (!state.guess) return state
      return { ...state, guess: { ...state.guess, targetId: action.id } }

    case 'CONFIRM_GUESS':
      if (!state.guess || !state.guess.targetId) return state
      return { ...state, guessConfirm: true }

    case 'KEEP_LOOKING':
      return { ...state, guess: null, guessConfirm: false }

    case 'FINAL_GUESS': {
      if (!state.guess || !state.guess.targetId) return state
      const opponent = otherTurn(state.turn)
      const charId = state.secrets[opponent]
      const correct = state.guess.targetId === charId
      return {
        ...state,
        flow: FLOW.result,
        guess: null,
        guessConfirm: false,
        result: { correct, charId, guessedId: state.guess.targetId },
      }
    }

    // Turn passing -------------------------------------------------------
    case 'END_TURN':
      if (state.flow !== FLOW.play) return state
      return {
        ...state,
        flow: FLOW.handoff,
        nextTurn: otherTurn(state.turn),
        guess: null,
        guessConfirm: false,
      }

    case 'HANDOFF_READY':
      if (state.flow !== FLOW.handoff) return state
      return { ...state, flow: FLOW.play, turn: state.nextTurn, pendingQuestion: null }

    // Wrap-up ------------------------------------------------------------
    case 'PLAY_AGAIN':
      if (!state.pack) return state
      return { ...state, flow: FLOW.secret, secretStep: 'a', notice: null, ...freshMatch() }

    case 'CHANGE_PACK':
      return { ...state, flow: FLOW.packs, editingId: null, notice: null, guess: null, guessConfirm: false }

    default:
      return state
  }
}
