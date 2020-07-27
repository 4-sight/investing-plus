import { getScriptChanges } from "../";
import { defaults } from "../../testHelpers";

describe("getScriptChanges", () => {
  it("should convert store state changes into script state changes", () => {
    expect.assertions(8);

    const storeChanges0 = {};
    expect(getScriptChanges(storeChanges0)).toEqual([storeChanges0, 0]);

    const storeChanges1 = { blocking: true };
    expect(getScriptChanges(storeChanges1)).toEqual([storeChanges1, 1]);

    const storeChanges2 = { enabled: true };
    expect(getScriptChanges(storeChanges2)[0]).not.toEqual(storeChanges2);
    expect(getScriptChanges(storeChanges2)).toEqual([{}, 0]);

    const storeChanges3 = { blocking: true, enabled: false };
    expect(getScriptChanges(storeChanges3)[0]).not.toEqual(storeChanges3);
    expect(getScriptChanges(storeChanges3)).toEqual([{ blocking: true }, 1]);

    const storeChanges4 = { ...defaults.store };
    expect(getScriptChanges(storeChanges4)[0]).not.toEqual(storeChanges4);
    expect(getScriptChanges(storeChanges4)).toEqual([
      {
        blocking: defaults.store.blocking,
        blackList: defaults.store.blackList,
        whiteList: defaults.store.whiteList,
      },
      3,
    ]);
  });
});
