export const getSanitizer = <T>(defaultStore: () => T) => (store: any): T => {
  const dStore = defaultStore();
  let sanitized: T = { ...dStore };

  if (typeof store === "object" && !Array.isArray(store)) {
    for (let k in dStore) {
      if (typeof store[k] === typeof dStore[k]) {
        sanitized[k] = store[k];
      }
    }
  }

  return sanitized;
};
