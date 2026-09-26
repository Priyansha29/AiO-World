import type { NextFunction, Response } from "express";
import express from "express";
import cors from "cors";
import collegesRouter from "./routes/colleges.js";
import sidequestsRouter from "./modules/sidequests/routes/sidequests.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", collegesRouter);
app.use("/api", sidequestsRouter);

/**
 * Unknown API route. Only `/api` is 404'd — an unknown non-API path falls
 * through to Express's default handler, which keeps the SPA-serving frontend
 * free to answer those itself.
 */
app.use("/api", (_req, res: Response) => {
  res.status(404).json({ error: "not_found", message: "Unknown API endpoint." });
});

/**
 * Terminal error handler.
 *
 * Express 5 forwards rejected promises here, so an async handler that throws
 * lands in this rather than hanging the request. Two jobs:
 *
 *   1. Tell a client mistake apart from a server fault. A body that is not
 *      valid JSON, or is too large, is the caller's problem and gets a 4xx.
 *      Reporting those as 500 would tell a student that "Something got lost"
 *      means the site is broken, when their own request was malformed.
 *   2. Never leak internals. The real error is logged for the developer and
 *      withheld from the client: no stack traces, no file paths, and nothing
 *      resembling a database or driver error.
 */
interface HttpishError {
  type?: string;
}

app.use((err: unknown, _req: express.Request, res: Response, _next: NextFunction) => {
  const candidate = err as HttpishError | null;

  // `express.json()` rejection: malformed body or payload over the limit.
  if (candidate?.type === "entity.parse.failed") {
    res.status(400).json({
      error: "invalid_json",
      message: "That request body wasn't valid JSON.",
    });
    return;
  }
  if (candidate?.type === "entity.too.large") {
    res.status(413).json({
      error: "payload_too_large",
      message: "That request was too large.",
    });
    return;
  }

  console.error("[api] unhandled error:", err);
  res.status(500).json({
    error: "internal_error",
    message: "Something got lost somewhere. Please try again.",
  });
});

export default app;
