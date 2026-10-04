import { Request, Response, NextFunction } from "express";

const AUTHORITY_TOKEN = "demo-authority-token";

export function requireAuthority(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.headers["x-authority-token"];

  if (!token || token !== AUTHORITY_TOKEN) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
}
