/**
 * DEMO DATA — fictional campuses.
 *
 * No real institution is represented here. This catalogue is swapped for real
 * college data via the data layer; the domain contract stays the same.
 */

/** @type {import('../../domain/campus-types.js').College[]} */
export const MOCK_COLLEGES = [
  {
    id: 'col-ait',
    name: 'Amberfield Institute of Technology',
    abbreviation: 'AIT',
    city: 'Bengaluru',
    state: 'Karnataka',
    university: 'Crestline University',
    established: 2009,
    website: 'https://ait.example.edu',
  },
  {
    id: 'col-nce',
    name: 'Northgate College of Engineering',
    abbreviation: 'NCE',
    city: 'Pune',
    state: 'Maharashtra',
    university: 'Vihaan University',
    established: 2012,
    website: 'https://nce.example.edu',
  },
  {
    id: 'col-ced',
    name: 'Cedarwood University',
    city: 'Chennai',
    state: 'Tamil Nadu',
    established: 2004,
  },
  {
    id: 'col-smc',
    name: 'Sunrise Medical College',
    abbreviation: 'SMC',
    city: 'Kochi',
    state: 'Kerala',
    established: 2015,
  },
  {
    id: 'col-kid',
    name: 'Kalinga Design Institute',
    abbreviation: 'KID',
    city: 'Bhubaneswar',
    state: 'Odisha',
    established: 2018,
  },
  {
    id: 'col-rsc',
    name: 'Riverside School of Commerce',
    abbreviation: 'RSC',
    city: 'Hyderabad',
    state: 'Telangana',
    established: 2010,
  },
]