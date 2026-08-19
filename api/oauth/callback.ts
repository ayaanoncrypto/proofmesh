import express from "express";
import { registerOAuthRoutes } from "../../server/_core/oauth";
import type { Request, Response } from "express";

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));
registerOAuthRoutes(app);

export default function handler(req: Request, res: Response) {
  app(req, res);
}
