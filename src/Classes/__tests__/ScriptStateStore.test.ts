import { ScriptStateStore } from "../";
import { ScriptState } from "../ScriptState";
import { defaultStore } from "../../constants";

describe("ScriptStateStore", () => {
  //Setup

  const defaultState = new ScriptState(defaultStore);
  //============================================

  it("should have a getter", () => {
    expect.assertions(1);

    const store = new ScriptStateStore(defaultState);

    expect(store.get("blocking")).toEqual(defaultStore.blocking);
  });

  it("should have a setter", () => {
    expect.assertions(2);

    const store = new ScriptStateStore(defaultState);
    expect(store.get("blocking")).toEqual(defaultStore.blocking);
    store.set("blocking", false);
    expect(store.get("blocking")).toEqual(false);
  });

  it("should replace state with an overrideState method", () => {
    expect.assertions(2);

    const store = new ScriptStateStore(defaultState);
    expect(store.get("blocking")).toEqual(defaultStore.blocking);
    store.overrideState(new ScriptState({ ...defaultStore, blocking: false }));

    expect(store.get("blocking")).toEqual(false);
  });
});
