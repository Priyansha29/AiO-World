/**
 * Initial college directory — real Pune institutions.
 *
 * This is an initial directory (not a complete list of Pune colleges). It is
 * bundled as the front-end data layer for now; the same domain contract will
 * be served by the college API in a later iteration.
 */

/** @type {import('../../domain/campus-types.js').College[]} */
export const MOCK_COLLEGES = [
  {
    id: 'col-coep',
    name: 'College of Engineering Pune',
    abbreviation: 'COEP',
    city: 'Shivajinagar',
    state: 'Pune',
  },
  {
    id: 'col-vit',
    name: 'Vishwakarma Institute of Technology',
    abbreviation: 'VIT',
    city: 'Bibwewadi',
    state: 'Pune',
  },
  {
    id: 'col-pict',
    name: 'Pune Institute of Computer Technology',
    abbreviation: 'PICT',
    city: 'Dhankawadi',
    state: 'Pune',
  },
  {
    id: 'col-sit',
    name: 'Symbiosis Institute of Technology',
    abbreviation: 'SIT',
    city: 'Lavale',
    state: 'Pune',
  },
  {
    id: 'col-pccoe',
    name: 'Pimpri Chinchwad College of Engineering',
    abbreviation: 'PCCOE',
    city: 'Nigdi',
    state: 'Pune',
  },
  {
    id: 'col-mitwpu',
    name: 'MIT World Peace University',
    abbreviation: 'MWPU',
    city: 'Kothrud',
    state: 'Pune',
  },
]