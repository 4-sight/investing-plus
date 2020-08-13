export const isGenuineUpdate = <T>(state: T, update: Partial<T>): boolean => {
  if (
    typeof update !== "object" ||
    Array.isArray(update) ||
    Object.keys(update).length < 1
  ) {
    return false;
  }

  for (let k in update) {
    if (k in state) {
      if (typeof update[k] !== typeof state[k]) {
        return false;
      }
    } else {
      return false;
    }
  }

  return true;
};
