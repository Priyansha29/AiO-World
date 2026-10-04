/**
 * Currency API client — talks to the AiO World backend, never to a provider
 * directly. Rate table is USD-anchored and covers every supported pair, so the
 * tool fetches one small document and recalculates any pair locally.
 */

const BASE = '/api/currency'
const REQUEST_TIMEOUT_MS = 12_000

export class CurrencyApiError extends Error {
  constructor(kind, message) {
    super(message)
    this.name = 'CurrencyApiError'
    this.kind = kind
  }
}

export async function fetchRates({ signal } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  const onExternalAbort = () => controller.abort()
  signal?.addEventListener('abort', onExternalAbort)

  let response
  try {
    response = await fetch(`${BASE}/rates?base=USD`, { signal: controller.signal })
  } catch (error) {
    throw toApiError(error)
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', onExternalAbort)
  }

  if (!response.ok) {
    throw new CurrencyApiError('unavailable', 'Exchange rates are temporarily unavailable.')
  }

  let payload = null
  try {
    payload = await response.json()
  } catch {
    throw new CurrencyApiError('unavailable', 'Exchange rates are temporarily unavailable.')
  }

  if (
    !payload ||
    typeof payload.rates !== 'object' ||
    payload.rates === null ||
    typeof payload.updatedAt !== 'string' ||
    typeof payload.source !== 'string'
  ) {
    throw new CurrencyApiError('unavailable', 'Exchange rates are temporarily unavailable.')
  }

  return {
    rates: payload.rates,
    source: payload.source,
    updatedAt: payload.updatedAt,
    fetchedAt: payload.fetchedAt ?? payload.updatedAt,
    cached: payload.cached === true,
  }
}

function toApiError(error) {
  if (error instanceof CurrencyApiError) return error
  const name = error && error.name
  if (name === 'AbortError') {
    return new CurrencyApiError('network', 'The rate request timed out.')
  }
  if (error instanceof TypeError) {
    return new CurrencyApiError('network', 'Could not connect to the rate service.')
  }
  return new CurrencyApiError('unavailable', 'Exchange rates are temporarily unavailable.')
}