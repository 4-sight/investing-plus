import { StoreState } from "../types";
import { defaultStore } from "../constants";
import { UserStore } from "../Classes";

export const sanitizeStore = (store: any): StoreState => {
  const dStore = defaultStore();
  let sanitized: StoreState = { ...dStore };

  if (typeof store === "object" && !Array.isArray(store)) {
    for (let k in dStore) {
      if (typeof store[k] === typeof dStore[k]) {
        if (dStore[k] instanceof UserStore) {
          if (store[k] instanceof UserStore) {
            sanitized[k] = store[k];
          }
        } else {
          sanitized[k] = store[k];
        }
      }
    }
  }

  return sanitized;
};
