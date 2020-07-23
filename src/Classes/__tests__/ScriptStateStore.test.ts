import { ScriptStateStore } from "../";
import { ScriptState } from "../ScriptState";
import { defaults } from "../../testHelpers";

describe("ScriptStateStore", () => {
  //Setup

  const defaultState = new ScriptState(defaults.store);
  //============================================

  it("should have a getter", () => {
    expect.assertions(1);

    const store = new ScriptStateStore(defaultState);

    expect(store.get("blocking")).toEqual(defaults.store.blocking);
  });

  it("should have a setter", () => {
    expect.assertions(2);

    const store = new ScriptStateStore(defaultState);
    expect(store.get("blocking")).toEqual(defaults.store.blocking);
    store.set("blocking", false);
    expect(store.get("blocking")).toEqual(false);
  });

  it("should replace state with an overrideState method", () => {
    expect.assertions(2);

    const store = new ScriptStateStore(defaultState);
    expect(store.get("blocking")).toEqual(defaults.store.blocking);
    store.overrideState({ blocking: false });

    expect(store.get("blocking")).toEqual(false);
  });
});
