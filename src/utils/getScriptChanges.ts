import { StoreState, ScriptStateChanges } from "../types";

export const getScriptChanges = (
  storeChanges: Partial<StoreState>
): [ScriptStateChanges, number] => {
  const filterList = ["enabled"];

  const scriptChanges = { ...storeChanges };

  filterList.forEach((key) => {
    if (key in scriptChanges) {
      delete scriptChanges[key];
    }
  });

  return [scriptChanges, Object.keys(scriptChanges).length];
};
