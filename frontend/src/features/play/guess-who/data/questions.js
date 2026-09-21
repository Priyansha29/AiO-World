/**
 * Question suggestions for the shared-screen game.
 *
 * The website never answers these automatically — players ask them out loud
 * over Discord and tap YES / NO to record what they heard. Each question still
 * maps to a character attribute so future auto-modes (and the upcoming pack
 * format) can reuse the same list.
 */

export const QUESTION_GROUPS = [
  { id: 'looks', title: 'Looks' },
  { id: 'face', title: 'Face' },
  { id: 'accessories', title: 'Accessories' },
  { id: 'clothing', title: 'Clothing' },
]

export const QUESTIONS = [
  // Looks ---------------------------------------------------------------
  { id: 'gender-male', group: 'looks', label: 'Male?', text: 'Is your person male?', attribute: 'gender', value: 'male' },
  { id: 'gender-female', group: 'looks', label: 'Female?', text: 'Is your person female?', attribute: 'gender', value: 'female' },
  { id: 'hair-black', group: 'looks', label: 'Black hair?', text: 'Does your person have black hair?', attribute: 'hair', value: 'black' },
  { id: 'hair-brown', group: 'looks', label: 'Brown hair?', text: 'Does your person have brown hair?', attribute: 'hair', value: 'brown' },
  { id: 'hair-blonde', group: 'looks', label: 'Blonde hair?', text: 'Does your person have blonde hair?', attribute: 'hair', value: 'blonde' },
  { id: 'hair-red', group: 'looks', label: 'Red hair?', text: 'Does your person have red hair?', attribute: 'hair', value: 'red' },
  { id: 'hair-length-short', group: 'looks', label: 'Short hair?', text: 'Does your person have short hair?', attribute: 'hairLength', value: 'short' },
  { id: 'hair-length-medium', group: 'looks', label: 'Medium hair?', text: 'Does your person have medium hair?', attribute: 'hairLength', value: 'medium' },
  { id: 'hair-length-long', group: 'looks', label: 'Long hair?', text: 'Does your person have long hair?', attribute: 'hairLength', value: 'long' },
  { id: 'skin-light', group: 'looks', label: 'Light skin?', text: 'Does your person have a light skin tone?', attribute: 'skinTone', value: 'light' },
  { id: 'skin-medium', group: 'looks', label: 'Medium skin?', text: 'Does your person have a medium skin tone?', attribute: 'skinTone', value: 'medium' },
  { id: 'skin-dark', group: 'looks', label: 'Dark skin?', text: 'Does your person have a dark skin tone?', attribute: 'skinTone', value: 'dark' },

  // Face -----------------------------------------------------------------
  { id: 'glasses', group: 'face', label: 'Glasses?', text: 'Does your person wear glasses?', attribute: 'glasses', value: true },
  { id: 'beard', group: 'face', label: 'Beard?', text: 'Does your person have a beard?', attribute: 'beard', value: true },

  // Accessories ----------------------------------------------------------
  { id: 'hat', group: 'accessories', label: 'Hat?', text: 'Does your person wear a hat?', attribute: 'hat', value: true },
  { id: 'accessory-earrings', group: 'accessories', label: 'Earrings?', text: 'Does your person wear earrings?', attribute: 'accessory', value: 'earrings' },
  { id: 'accessory-scarf', group: 'accessories', label: 'Scarf?', text: 'Does your person wear a scarf?', attribute: 'accessory', value: 'scarf' },
  { id: 'accessory-headphones', group: 'accessories', label: 'Headphones?', text: 'Does your person wear headphones?', attribute: 'accessory', value: 'headphones' },

  // Clothing -------------------------------------------------------------
  { id: 'clothing-red', group: 'clothing', label: 'Red?', text: 'Is your person wearing red?', attribute: 'clothing', value: 'red' },
  { id: 'clothing-blue', group: 'clothing', label: 'Blue?', text: 'Is your person wearing blue?', attribute: 'clothing', value: 'blue' },
  { id: 'clothing-green', group: 'clothing', label: 'Green?', text: 'Is your person wearing green?', attribute: 'clothing', value: 'green' },
  { id: 'clothing-yellow', group: 'clothing', label: 'Yellow?', text: 'Is your person wearing yellow?', attribute: 'clothing', value: 'yellow' },
  { id: 'clothing-purple', group: 'clothing', label: 'Purple?', text: 'Is your person wearing purple?', attribute: 'clothing', value: 'purple' },
  { id: 'clothing-black', group: 'clothing', label: 'Black?', text: 'Is your person wearing black?', attribute: 'clothing', value: 'black' },
  { id: 'clothing-white', group: 'clothing', label: 'White?', text: 'Is your person wearing white?', attribute: 'clothing', value: 'white' },
]

const QUESTION_BY_ID = new Map(QUESTIONS.map((q) => [q.id, q]))

export function getQuestion(questionId) {
  return QUESTION_BY_ID.get(questionId) ?? null
}

/** Does `character` match the fact a question is asking about? */
export function matchesCharacter(question, character) {
  if (!question || !character) return false
  return character[question.attribute] === question.value
}
