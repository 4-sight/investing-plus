import { GeneralStore } from "../";
import { defaults } from "../../../testHelpers";
import { GeneralStoreState, Blocking } from "../../../types";
import { chrome } from "jest-chrome";

describe("GeneralStore", () => {
  // Setup

  beforeEach(() => {
    chrome.storage.sync.set.mockClear();
    chrome.storage.sync.get.mockClear();
  });

  //================================

  it("should be a class", () => {
    expect.assertions(1);

    const g = new GeneralStore();

    expect(g).toBeInstanceOf(GeneralStore);
  });

  it("should call chrome.storage.sync.get and set the store state if given", () => {
    expect.assertions(4);

    const mockSyncStore: GeneralStoreState = {
      enabled: false,
      blocking: Blocking.WHITELIST,
    };
    chrome.storage.sync.get.mockImplementationOnce((keys: string[], cb) => {
      cb({ [keys[0]]: mockSyncStore });
    });
    expect(chrome.storage.sync.get).not.toHaveBeenCalled();

    const store = new GeneralStore(defaults.generalStore);
    expect(chrome.storage.sync.get).toHaveBeenCalledTimes(1);
    expect(chrome.storage.sync.get.mock.calls[0][0]).toEqual(["generalStore"]);
    expect(store.getState()).toEqual(mockSyncStore);
  });

  it("should call chrome.storage.sync.set if there is no generalStore in storage", () => {
    expect.assertions(6);

    chrome.storage.sync.get.mockImplementationOnce((keys: string[], cb) => {
      cb({});
    });
    expect(chrome.storage.sync.get).not.toHaveBeenCalled();
    expect(chrome.storage.sync.set).not.toHaveBeenCalled();

    new GeneralStore(defaults.generalStore);
    expect(chrome.storage.sync.get).toHaveBeenCalledTimes(1);
    expect(chrome.storage.sync.set).toHaveBeenCalledTimes(1);

    expect(chrome.storage.sync.get.mock.calls[0][0]).toEqual(["generalStore"]);
    expect(chrome.storage.sync.set.mock.calls[0][0]).toEqual({
      generalStore: { ...defaults.generalStore },
    });
  });

  it("should contain a valid store state", () => {
    expect.assertions(5);

    expect(new GeneralStore().getState()).toEqual(defaults.generalStore);
    expect(new GeneralStore(defaults.generalStore).getState()).toEqual(
      defaults.generalStore
    );
    expect(
      new GeneralStore({ ...defaults.generalStore, enabled: false }).getState()
    ).toEqual({ ...defaults.generalStore, enabled: false });
    expect(
      new GeneralStore({
        ...defaults.generalStore,
        enabled: false,
        invalid: "test",
      } as any).getState()
    ).toEqual({ ...defaults.generalStore, enabled: false });
    expect(
      new GeneralStore({ enabled: false, invalid: "test" } as any).getState()
    ).toEqual({ ...defaults.generalStore, enabled: false });
  });

  describe("Method - getState", () => {
    it("should return a dereferenced state", () => {
      expect.assertions(2);

      const store = new GeneralStore(defaults.generalStore);
      const state = store.getState();
      expect(state).toEqual(defaults.generalStore);
      state.enabled = !state.enabled;
      expect(state).not.toEqual(defaults.generalStore);
    });
  });

  describe("Method - setState", () => {
    it("should set a dereferenced state", () => {
      expect.assertions(3);

      const store = new GeneralStore(defaults.generalStore);
      const newState: GeneralStoreState = {
        ...defaults.generalStore,
        blocking: Blocking.WHITELIST,
      };

      expect(store.getState()).toEqual(defaults.generalStore);

      store.setState(newState);

      expect(store.getState()).toEqual(newState);

      newState.blocking = Blocking.BLACKLIST;

      expect(store.getState()).not.toEqual(defaults.generalStore);
    });
  });

  describe("Method - get", () => {
    it("should get a value", () => {
      expect.assertions(1);

      const store = new GeneralStore(defaults.generalStore);
      expect(store.get("blocking")).toEqual(defaults.generalStore.blocking);
    });
  });

  describe("Method - set", () => {
    it("should set a dereferenced value", () => {
      expect.assertions(2);

      const store = new GeneralStore(defaults.generalStore);
      const update: Partial<GeneralStoreState> = {
        blocking: Blocking.WHITELIST,
      };

      store.set(update);
      expect(store.get("blocking")).toEqual(update.blocking);

      update.blocking = Blocking.NONE;

      expect(store.get("blocking")).not.toEqual(update.blocking);
    });

    it("should return true for a valid update", () => {
      expect.assertions(1);

      const store = new GeneralStore(defaults.generalStore);
      const update = { blocking: Blocking.WHITELIST };
      expect(store.set(update)).toBe(true);
    });

    it("should return false for an invalid update", () => {
      expect.assertions(1);

      const store = new GeneralStore(defaults.generalStore);
      const update = { invalidKey: "a test" };
      expect(store.set(update as any)).toBe(false);
    });
  });

  describe("Method - getChanges", () => {
    it("should return the last changes, and the number of changed fields", () => {
      expect.assertions(4);

      const store = new GeneralStore(defaults.generalStore);
      const update1: Partial<GeneralStoreState> = {
        blocking: Blocking.BLACKLIST,
      };
      const update2: Partial<GeneralStoreState> = { enabled: false };
      const update3: Partial<GeneralStoreState> = {
        enabled: false,
        blocking: Blocking.WHITELIST,
      };

      const newState: GeneralStoreState = {
        ...defaults.generalStore,
        enabled: false,
      };

      store.set(update1);
      expect(store.getChanges()).toEqual([update1, 1]);
      store.set(update2);
      expect(store.getChanges()).toEqual([update2, 1]);
      store.set(update3);
      expect(store.getChanges()).toEqual([update3, 2]);
      store.setState(newState);
      expect(store.getChanges()).toEqual([
        newState,
        Object.keys(defaults.generalStore).length,
      ]);
    });
  });
});
