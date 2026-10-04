/**
 * Exchange-rate retrieval with a short in-memory cache.
 *
 * The frontend asks this service; this service asks the configured provider.
 * Caching is deliberately small (one base currency, ten minutes) so tool use
 * never hammers the free provider, while `fetchedAt`/`updatedAt` still tell the
 * client exactly how fresh the numbers are — nothing is dressed up as "live"
 * when it is not.
 */
import {
  EXCHANGE_RATE_PROVIDER_URL,
  EXCHANGE_RATE_SOURCE,
  PROVIDER_TIMEOUT_MS,
  RATE_CACHE_TTL_MS,
  SUPPORTED_CURRENCIES,
} from "../config.js";

export class InvalidCurrencyError extends Error {
  constructor() {
    super("Unsupported currency code.");
  }
}

export class RatesUnavailableError extends Error {
  constructor() {
    super("Exchange rates are temporarily unavailable.");
  }
}

interface RateRecord {
  rates: Record<string, number>;
  updatedAt: string;
  fetchedAt: string;
}

const cache = new Map<string, RateRecord>();

/**
 * Keep only supported, finite, positive rates out of an arbitrary provider
 * payload. Never trust the provider's shape — the point of a sanitizer is that
 * a hostile or broken upstream cannot smuggle garbage into the response.
 */
export function sanitizeRates(payload: unknown, base: string): Record<string, number> {
  const candidate = payload as Record<string, unknown> | null;
  if (candidate?.rates === null || typeof candidate?.rates !== "object") {
    throw new RatesUnavailableError();
  }
  const source = candidate.rates as Record<string, unknown>;
  const rates: Record<string, number> = {};
  for (const code of SUPPORTED_CURRENCIES) {
    const value = source[code];
    if (typeof value === "number" && Number.isFinite(value) && value > 0) {
      rates[code] = value;
    }
  }
  if (rates[base] === undefined) throw new RatesUnavailableError();
  return rates;
}

function extractUpdatedAt(payload: unknown): string {
  const candidate = payload as Record<string, unknown> | null;
  const utc = candidate?.time_last_update_utc;
  const unix = candidate?.time_last_update_unix;
  if (typeof utc === "string") {
    const parsed = Date.parse(utc);
    if (Number.isFinite(parsed)) return new Date(parsed).toISOString();
  }
  if (typeof unix === "number" && Number.isFinite(unix) && unix > 0) {
    return new Date(unix * 1000).toISOString();
  }
  return new Date().toISOString();
}

export function getRates(base: string) {
  if (!SUPPORTED_CURRENCIES.includes(base)) {
    return Promise.reject(new InvalidCurrencyError());
  }

  const hit = cache.get(base);
  if (hit && Date.now() - Date.parse(hit.fetchedAt) < RATE_CACHE_TTL_MS) {
    return Promise.resolve({
      base,
      rates: hit.rates,
      source: EXCHANGE_RATE_SOURCE,
      updatedAt: hit.updatedAt,
      fetchedAt: hit.fetchedAt,
      cached: true,
    });
  }

  return fetchRatesFromProvider(base).then((record) => {
    cache.set(base, record);
    return {
      base,
      rates: record.rates,
      source: EXCHANGE_RATE_SOURCE,
      updatedAt: record.updatedAt,
      fetchedAt: record.fetchedAt,
      cached: false,
    };
  });
}

async function fetchRatesFromProvider(base: string): Promise<RateRecord> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);
  try {
    const response = await fetch(`${EXCHANGE_RATE_PROVIDER_URL}/${base}`, {
      signal: controller.signal,
    });
    if (!response.ok) throw new RatesUnavailableError();
    const payload: unknown = await response.json();
    if ((payload as Record<string, unknown>)?.result !== "success") {
      throw new RatesUnavailableError();
    }
    const rates = sanitizeRates(payload, base);
    return {
      rates,
      updatedAt: extractUpdatedAt(payload),
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    if (error instanceof RatesUnavailableError) throw error;
    // Network failure, DNS, timeout/abort, malformed JSON — all behave the same
    // from the client's point of view.
    throw new RatesUnavailableError();
  } finally {
    clearTimeout(timer);
  }
}