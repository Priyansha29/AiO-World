import { Router, type Request, type Response } from "express";
import { SUPPORTED_CURRENCIES } from "../config.js";
import {
  InvalidCurrencyError,
  getRates,
} from "../services/exchange-rate.service.js";

const router = Router();

/**
 * GET /api/currency/currencies
 *
 * The codes the backend will serve, so the frontend only ever offers pairs the
 * provider can actually price. The frontend keeps the display metadata (name,
 * symbol, decimals); the codes themselves live here as the single authority.
 */
router.get("/currency/currencies", (_req: Request, res: Response) => {
  res.status(200).json({ currencies: SUPPORTED_CURRENCIES });
});

/**
 * GET /api/currency/rates?base=USD
 *
 * Returns USD-anchored rates (`rates[code]` = 1 USD in `code`) filtered to the
 * supported set, plus the provider's own update timestamp. `base` must be a
 * supported currency — the request never forwards arbitrary input to a third
 * party. The route does not throw; every provider failure becomes a clean 502
 * so clients can tell "rates down" apart from a generic server fault.
 */
router.get("/currency/rates", async (req: Request, res: Response) => {
  const raw = typeof req.query.base === "string" ? req.query.base : "USD";
  const base = raw.toUpperCase();
  if (!SUPPORTED_CURRENCIES.includes(base)) {
    res.status(400).json({
      error: "invalid_currency",
      message: `base must be one of: ${SUPPORTED_CURRENCIES.join(", ")}.`,
    });
    return;
  }

  try {
    const data = await getRates(base);
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof InvalidCurrencyError) {
      res.status(400).json({ error: "invalid_currency", message: "Unsupported currency code." });
      return;
    }
    res.status(502).json({
      error: "rates_unavailable",
      message: "Exchange rates are temporarily unavailable.",
    });
  }
});

export default router;