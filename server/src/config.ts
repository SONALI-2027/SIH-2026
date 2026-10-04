import dotenv from "dotenv";
dotenv.config();

export const PORT = parseInt(process.env.PORT || "4000", 10);
export const DATABASE_URL = process.env.DATABASE_URL || "";
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
