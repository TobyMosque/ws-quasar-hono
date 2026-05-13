import { createClient } from "backend/client";
import { useDiStore } from "stores/di";
import { type Pinia } from "pinia";

declare module "pinia" {
  export interface PiniaCustomProperties {
    api: ReturnType<typeof createClient>;
  }
}

export function createApi(pinia: Pinia) {
  const baseURL = import.meta.env.SSR
    ? `http://localhost:${process.env.PORT ?? 9100}`
    : "";
  
  const api = createClient(baseURL);
  pinia.use(() => ({ api }));
  return api;
}

export function useApi(pinia?: Pinia) {
  const diStore = useDiStore(pinia);
  return diStore.api;
}