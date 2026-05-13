import { hc } from "hono/client";
import type { AppType } from "./app.ts";

export const createClient = (baseUrl: string) => hc<AppType>(baseUrl);

export type { AppType };
