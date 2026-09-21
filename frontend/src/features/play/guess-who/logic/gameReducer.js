/**
 * Guess Who — game state machine (pure).
 *
 * This is a digital board game for two people sharing one browser over a
 * Discord call. The website keeps the characters, the public board,
 * elimination, the turn tracker, a manual question counter and the final
 * guess interaction. Everything else — picking a secret person, asking
 * questions, answering, deducing — happens privately and verbally between
 * the players, because the shared screen cannot hide anything from either
 * of them. There is deliberately no secret-character UI.
 */
import { createPack, getPack, toCharacter, CHARACTER_LIMIT } from '../data/packs.js'

export const FLOW = {
  start: 'start',
  packs: 'packs',
  build: 'build',
  ready: 'ready', // "secretly pick a person" instruction screen
  play: 'play',
  handoff: 'handoff',
  guess: 'guess',
  settle: 'settle', // "you made your guess — ask your opponent"
  end: 'end', // won / lost
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
    turn: TURN.A,
    nextTurn: TURN.B,
    eliminated: { A: [], B: [] },
    questions: 0,
    guess: null,
    result: null,
  }
}

function freshMatch() {
  return {
    turn: TURN.A,
    nextTurn: TURN.B,
    eliminated: { A: [], B: [] },
    questions: 0,
    guess: null,
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

    // Pre-game instructions ----------------------------------------------
    case 'START_READY': {
      if (!state.pack || state.pack.characters.length !== CHARACTER_LIMIT) return state
      return { ...state, flow: FLOW.ready, notice: null, ...freshMatch() }
    }

    case 'READY_START':
      return state.flow === FLOW.ready ? { ...state, flow: FLOW.play } : state

    // The board ----------------------------------------------------------
    case 'TOGGLE_ELIMINATE': {
      if (state.flow !== FLOW.play) return state
      const current = state.eliminated[state.turn]
      const next = current.includes(action.id)
        ? current.filter((id) => id !== action.id)
        : [...current, action.id]
      return { ...state, eliminated: { ...state.eliminated, [state.turn]: next } }
    }

    case 'ASK_QUESTION':
      if (state.flow !== FLOW.play) return state
      return { ...state, questions: state.questions + 1 }

    // Turn passing -------------------------------------------------------
    case 'END_TURN':
      if (state.flow !== FLOW.play) return state
      return { ...state, flow: FLOW.handoff, nextTurn: otherTurn(state.turn) }

    case 'HANDOFF_READY':
      if (state.flow !== FLOW.handoff) return state
      return {
        ...state,
        flow: FLOW.play,
        turn: state.nextTurn,
        nextTurn: otherTurn(state.nextTurn),
      }

    // Final guess --------------------------------------------------------
    case 'START_GUESS':
      if (state.flow !== FLOW.play) return state
      return { ...state, flow: FLOW.guess, guess: null }

    case 'SELECT_GUESS':
      if (state.flow !== FLOW.guess) return state
      return { ...state, guess: { targetId: action.id } }

    case 'CANCEL_GUESS':
      if (state.flow !== FLOW.guess) return state
      return { ...state, flow: FLOW.play, guess: null }

    case 'CONFIRM_GUESS':
      if (state.flow !== FLOW.guess || !state.guess?.targetId) return state
      return { ...state, flow: FLOW.settle }

    case 'DECLARE_WON':
      if (state.flow !== FLOW.settle) return state
      return { ...state, flow: FLOW.end, result: { won: true } }

    case 'DECLARE_LOST':
      if (state.flow !== FLOW.settle) return state
      return { ...state, flow: FLOW.end, result: { won: false } }

    // Wrap-up ------------------------------------------------------------
    case 'PLAY_AGAIN':
      if (!state.pack) return state
      return { ...state, flow: FLOW.ready, notice: null, ...freshMatch() }

    case 'CHANGE_PACK':
      return { ...state, flow: FLOW.packs, editingId: null, notice: null, guess: null, result: null }

    default:
      return state
  }
}