import type { Response } from "express";
import express from "express";
import cors from "cors";
import collegesRouter from "./routes/colleges.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", collegesRouter);

export default app;