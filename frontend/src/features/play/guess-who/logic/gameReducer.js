/**
 * Guess Who — game state machine (pure).
 *
 * This drives the whole local, shared-screen experience: choosing a pack,
 * building a College pack, the privacy hand-off secret picks, alternating
 * human turns, manual elimination and the final guess.
 *
 * There is deliberately no computer player, no networking and no automatic
 * answering/elimination. Both people share the screen and talk over Discord.
 */
import { createPack, getPack, toCharacter, CHARACTER_LIMIT } from '../data/packs.js'

export const FLOW = {
  start: 'start',
  packs: 'packs',
  build: 'build',
  preview: 'preview',
  secret: 'secret',
  play: 'play',
  handoff: 'handoff',
  result: 'result',
}

export const PLAYERS = { p1: 'p1', p2: 'p2' }

export function otherPlayer(player) {
  return player === PLAYERS.p1 ? PLAYERS.p2 : PLAYERS.p1
}

export function playerLabel(player) {
  return player === PLAYERS.p1 ? 'Player 1' : 'Player 2'
}

export function createInitialState() {
  return {
    flow: FLOW.start,
    pack: null,
    editingId: null,
    secretStep: 'p1', // p1 -> ready -> p2 -> locked
    secrets: { p1: null, p2: null },
    turn: PLAYERS.p1,
    nextTurn: PLAYERS.p2,
    eliminated: { p1: [], p2: [] },
    pendingQuestion: null,
    history: [],
    guess: null,
    guessConfirm: false,
    result: null,
  }
}

function freshMatch() {
  return {
    secrets: { p1: null, p2: null },
    turn: PLAYERS.p1,
    nextTurn: PLAYERS.p2,
    eliminated: { p1: [], p2: [] },
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
      if (state.pack && state.pack.id === meta.id && state.pack.characters.length > 0) {
        return { ...state, flow: FLOW.preview, editingId: null }
      }
      return { ...state, pack: createPack(meta), flow: FLOW.build, editingId: null }
    }

    case 'BACK_TO_PACKS':
      return { ...state, flow: FLOW.packs, editingId: null }

    case 'BACK_TO_START':
      return { ...state, flow: FLOW.start }

    case 'NEW_PACK': {
      const meta = getPack(action.packId)
      if (!meta) return state
      return { ...state, pack: createPack(meta), flow: FLOW.build, editingId: null, ...freshMatch() }
    }

    case 'ADD_MORE':
      return state.pack ? { ...state, flow: FLOW.build, editingId: null } : state

    case 'EDIT_CHARACTER':
      return { ...state, editingId: action.id, flow: FLOW.build }

    case 'CANCEL_EDIT':
      return {
        ...state,
        editingId: null,
        flow: state.pack && state.pack.characters.length > 0 ? FLOW.preview : FLOW.packs,
      }

    case 'SAVE_CHARACTER': {
      if (!state.pack) return state
      const character = toCharacter(action.character, action.character.id || action.id)
      const isEdit = Boolean(state.editingId)
      let characters
      if (isEdit) {
        characters = replaceCharacter(state.pack.characters, { ...character, id: state.editingId })
      } else {
        if (state.pack.characters.length >= CHARACTER_LIMIT) return state
        characters = [...state.pack.characters, { ...character, id: action.character.id }]
      }
      const pack = { ...state.pack, characters }
      const flow = isEdit ? FLOW.preview : characters.length >= CHARACTER_LIMIT ? FLOW.preview : FLOW.build
      return { ...state, pack, editingId: null, flow }
    }

    case 'REMOVE_CHARACTER': {
      if (!state.pack) return state
      const characters = state.pack.characters.filter((c) => c.id !== action.id)
      return { ...state, pack: { ...state.pack, characters } }
    }

    // Privacy hand-off: secret character picks ---------------------------
    case 'START_SECRET': {
      if (!state.pack || state.pack.characters.length !== CHARACTER_LIMIT) return state
      return { ...state, flow: FLOW.secret, secretStep: 'p1', ...freshMatch() }
    }

    case 'SECRET_P1': {
      if (state.secretStep !== 'p1') return state
      return { ...state, secrets: { ...state.secrets, p1: action.id }, secretStep: 'ready' }
    }

    case 'CONFIRM_SECRET_P1':
      return state.secretStep === 'ready' ? { ...state, secretStep: 'p2' } : state

    case 'SECRET_P2': {
      if (state.secretStep !== 'p2') return state
      return { ...state, secrets: { ...state.secrets, p2: action.id }, secretStep: 'locked' }
    }

    case 'START_GAME':
      if (state.secretStep !== 'locked') return state
      return { ...state, flow: FLOW.play, ...freshMatch(), secrets: state.secrets }

    // Player turn --------------------------------------------------------
    case 'PICK_QUESTION':
      if (state.pendingQuestion || state.guess) return state
      return { ...state, pendingQuestion: action.questionId }

    case 'CANCEL_PENDING_QUESTION':
      return { ...state, pendingQuestion: null }

    case 'RECORD_ANSWER': {
      if (!state.pendingQuestion) return state
      const entry = {
        id: `${state.turn}-${state.pendingQuestion}-${state.history.length}`,
        player: state.turn,
        questionId: state.pendingQuestion,
        answer: Boolean(action.answer),
      }
      return { ...state, history: [...state.history, entry], pendingQuestion: null }
    }

    case 'TOGGLE_ELIMINATE': {
      if (state.guess) return state
      const current = state.eliminated[state.turn]
      const next = current.includes(action.id)
        ? current.filter((id) => id !== action.id)
        : [...current, action.id]
      return { ...state, eliminated: { ...state.eliminated, [state.turn]: next } }
    }

    // Final guess --------------------------------------------------------
    case 'START_GUESS':
      if (state.guess) return state
      return { ...state, guess: { player: state.turn, targetId: null }, guessConfirm: false }

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
      const guesser = state.guess.player
      const opponent = otherPlayer(guesser)
      const charId = state.secrets[opponent]
      const correct = state.guess.targetId === charId
      return {
        ...state,
        flow: FLOW.result,
        guess: null,
        guessConfirm: false,
        result: {
          winner: correct ? guesser : opponent,
          guesser,
          correct,
          charId,
          guessedId: state.guess.targetId,
        },
      }
    }

    // Turn passing -------------------------------------------------------
    case 'END_TURN':
      if (state.flow !== FLOW.play) return state
      return { ...state, flow: FLOW.handoff, nextTurn: otherPlayer(state.turn), guess: null, guessConfirm: false }

    case 'HANDOFF_READY':
      if (state.flow !== FLOW.handoff) return state
      return { ...state, flow: FLOW.play, turn: state.nextTurn, pendingQuestion: null }

    // Wrap-up ------------------------------------------------------------
    case 'PLAY_AGAIN':
      if (!state.pack) return state
      return { ...state, flow: FLOW.secret, secretStep: 'p1', ...freshMatch() }

    case 'CHANGE_PACK':
      return { ...state, flow: FLOW.packs, editingId: null, guess: null, guessConfirm: false }

    default:
      return state
  }
}
