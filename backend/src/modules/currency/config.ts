/**
 * Currency module configuration.
 *
 * The tool only ever calls the provider configured here — the backend never
 * proxies user-supplied URLs. open.er-api.com is a genuinely keyless free feed
 * (the free ExchangeRate-API endpoint), so no API key exists to leak. If a
 * keyed provider ever replaces it, the key must live in `backend/.env` and be
 * read here — never in frontend source or VITE_* variables.
 */
export const SUPPORTED_CURRENCIES = [
  "USD",
  "INR",
  "EUR",
  "GBP",
  "JPY",
  "CNY",
  "AUD",
  "CAD",
  "SGD",
  "AED",
  "CHF",
  "KRW",
  "HKD",
  "MYR",
  "NZD",
  "THB",
  "PHP",
  "IDR",
  "MXN",
  "ZAR",
  "TRY",
  "PLN",
  "RUB",
  "BRL",
  "DKK",
  "ILS",
  "SEK",
  "NOK",
];

export const EXCHANGE_RATE_PROVIDER_URL = "https://open.er-api.com/v6/latest";

export const EXCHANGE_RATE_SOURCE = "open.er-api.com (free ExchangeRate-API)";

/** How long a fetched rate table may be reused before the provider is asked again. */
export const RATE_CACHE_TTL_MS = 10 * 60 * 1000;

/** Abort provider calls that hang longer than this. */
export const PROVIDER_TIMEOUT_MS = 6_000;