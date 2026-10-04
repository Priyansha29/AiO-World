/**
 * Currency metadata + pure conversion/formatting helpers.
 *
 * The codes here mirror `backend/src/modules/currency/config.ts` — the backend
 * is the authority that decides which codes it will serve, this module is the
 * display metadata (name, symbol, decimals). The tool never hard-codes a rate;
 * rates only ever come from the API response.
 */

const DECIMALS = {
  JPY: 0,
  KRW: 0,
  IDR: 0,
}

export const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'ILS', name: 'Israeli New Shekel', symbol: '₪' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
]

export function currencyDecimals(code) {
  return DECIMALS[code] ?? 2
}

export function currencyByCode(code) {
  return CURRENCIES.find((entry) => entry.code === code) ?? null
}

export function rateFor(from, to, rates) {
  if (from === to) return 1
  if (!rates) return null
  const fromRate = rates[from]
  const toRate = rates[to]
  if (typeof fromRate !== 'number' || typeof toRate !== 'number') return null
  return toRate / fromRate
}

export function convertAmount(amount, from, to, rates) {
  const rate = rateFor(from, to, rates)
  if (rate === null) return null
  return amount * rate
}

export function formatAmount(value, code) {
  const decimals = currencyDecimals(code)
  const absolute = Math.abs(value)
  if (absolute > 0 && absolute < Math.pow(10, -decimals)) {
    return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 4 }).format(value)
  }
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatRate(value) {
  return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 6 }).format(value)
}

export function formatTimestamp(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  const label = date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  })
  return `${label} UTC`
}