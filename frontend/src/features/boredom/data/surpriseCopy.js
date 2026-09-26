/**
 * Micro-copy for the boredom machine.
 *
 * Kept out of the components on purpose: the tone of this feature is the whole
 * point of it, and tone is much easier to review in one file than scattered
 * through JSX. Lines are short and spoken aloud in the player's head.
 *
 * The `…` on some lines is intentional — it lets a line land without a full
 * stop, like someone thinking out loud.
 */

/** Shown while the paper is still closed and doing its wiggle. */
export const COPY_CLOSED = [
  'Okay. You’re bored.',
  'Alright. This is fixable.',
  'Let’s do something about that.',
  'Good. Boredom is just unspent curiosity…',
]

/** Shown as the folds rise and the four options appear. */
export const COPY_CHOOSING = [
  'Pick a direction.',
  'Pick your poison.',
  'Okay. What are we in the mood for?',
  'Go on. Commit to one.',
]

/** Shown while the paper snaps shut, shakes and spins. */
export const COPY_SHUFFLING = [
  'Interesting choice…',
  'Okay… let’s see.',
  'Hold on. Something’s happening.',
  'Well. You asked for this.',
  'No peeking.',
]

/** Small label on the closed paper, before anything happens. */
export const COPY_PAPER_LABEL = 'FOLD ME'

/** Shown on the core while the four folds are open. */
export const COPY_CORE_IDLE = [
  'The paper is open. Pick a fold.',
  'Four folds. One of them is you.',
  'Go on. Point at one.',
]

/** Hovering a fold previews its mood in the core. */
export const COPY_CORE_PREVIEW = {
  laugh: 'Something silly, then.',
  curious: 'A fact you will not expect.',
  moving: 'You will actually stand up for this.',
  anywhere: 'Completely unchecked. Perfect.',
}

/** Result header kickers, keyed by type. */
export const COPY_KICKER = {
  fact: 'DID YOU KNOW',
  prompt: 'HONESTLY',
  game: 'HERE’S SOMETHING TO DO',
  activity: 'RIGHT NOW',
  read: 'A RABBIT HOLE, UNLOCKED',
  watch: 'TONIGHT’S WILDCARD',
  listen: 'PUT YOUR HEADPHONES IN',
}

/** Shown when the player has run the machine several times this session. */
export const COPY_RETURNING = 'Still nothing scratched the itch?'

/** The idle line on the "give me another" button. */
export const COPY_AGAIN = 'Give me another'
export const COPY_DONE = 'I’m done'
export const COPY_CLOSE = 'Back to AiO World'
