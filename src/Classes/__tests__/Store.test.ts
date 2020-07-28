import { Store } from "../Store";
import { EventMessage, StoreState, Blocking } from "../../types";
import { chrome } from "jest-chrome";
import { defaults } from "../../testHelpers";

describe("Store", () => {
  // Setup
  beforeEach(() => {
    chrome.runtime.onMessage.clearListeners();
    chrome.runtime.sendMessage.mockClear();
    chrome.storage.sync.set.mockClear();
    chrome.storage.sync.get.mockClear();
    chrome.storage.onChanged.clearListeners();
  });

  // ==========================================

  it("should be a Class", () => {
    expect.assertions(1);
    let s = new Store(defaults.store, () => {});
    expect(s).toBeInstanceOf(Store);
  });

  it("should have a getStore method that returns the store state", () => {
    expect.assertions(1);
    let store = new Store(defaults.store, () => {});

    expect(store.getStore()).toEqual(defaults.store);
  });

  it("should have a setStore method that overrides the store state", () => {
    expect.assertions(2);
    const newState: StoreState = {
      ...defaults.store,
      enabled: false,
      blocking: Blocking.BLACKLIST,
    };

    let store = new Store(defaults.store, () => {});

    expect(store.getStore()).toEqual(defaults.store);
    store.setStore(newState);
    expect(store.getStore()).toEqual(newState);
  });

  it("should have a get method that returns a store state value", () => {
    expect.assertions(1);
    const store = new Store(defaults.store, () => {});

    expect(store.get("enabled")).toEqual(defaults.store.enabled);
  });

  it("should have a set method that sets a value in store state", () => {
    expect.assertions(2);
    const store = new Store(defaults.store, () => {});

    expect(store.get("enabled")).toEqual(defaults.store.enabled);
    store.set({ enabled: false });
    expect(store.get("enabled")).toEqual(false);
  });

  it("should publish the new store state on change", () => {
    expect.assertions(4);
    expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();
    const store = new Store(defaults.store, () => {});

    expect(store.get("enabled")).toEqual(defaults.store.enabled);
    store.set({ enabled: false });
    expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
      type: EventMessage.STORE_UPDATED,
      payload: { ...defaults.store, enabled: false },
    });
  });

  it("should set sync storage on update", () => {
    expect.assertions(4);
    expect(chrome.storage.sync.set).not.toHaveBeenCalled();
    const store = new Store(defaults.store, () => {});
    expect(chrome.storage.sync.set).not.toHaveBeenCalled();

    store.set({ enabled: false });
    expect(chrome.storage.sync.set).toHaveBeenCalled();
    expect(chrome.storage.sync.set).toHaveBeenCalledWith({
      store: { ...defaults.store, enabled: false },
    });
  });

  it("should sync with sync storage on creation", () => {
    expect.assertions(7);
    const syncStore: StoreState = {
      ...defaults.store,
      enabled: false,
      blocking: Blocking.WHITELIST,
    };

    chrome.storage.sync.get.mockImplementationOnce((key, cb) => {
      cb({});
    });

    expect(chrome.storage.sync.get).not.toHaveBeenCalled();
    expect(chrome.storage.sync.set).not.toHaveBeenCalled();

    const store1 = new Store(defaults.store, () => {});
    expect(store1.getStore()).toEqual(defaults.store);
    expect(chrome.storage.sync.set).toHaveBeenCalled();
    expect(chrome.storage.sync.set).toHaveBeenCalledWith({
      store: defaults.store,
    });

    chrome.storage.sync.get.mockImplementationOnce((key, cb) => {
      cb({ store: syncStore });
    });

    const store2 = new Store(defaults.store, () => {});
    expect(store2.getStore()).not.toEqual(defaults.store);
    expect(store2.getStore()).toEqual(syncStore);
  });

  it("should receive updated state from sync storage", () => {
    expect.assertions(4);
    const syncStore: StoreState = {
      ...defaults.store,
      enabled: false,
      blocking: Blocking.BLACKLIST,
    };

    expect(chrome.storage.onChanged.hasListeners()).toBe(false);
    const store = new Store(defaults.store, () => {});
    expect(chrome.storage.onChanged.hasListeners()).toBe(true);
    expect(store.getStore()).toEqual(defaults.store);

    chrome.storage.onChanged.callListeners(
      { store: { oldValue: defaults.store, newValue: syncStore } },
      "test"
    );

    expect(store.getStore()).toEqual(syncStore);
  });

  it("should return a store on STORE_GET_STORE", () => {
    expect.assertions(6);
    const sendResponseSpy = jest.fn();

    expect(chrome.runtime.onMessage.hasListeners()).toBe(false);
    new Store(defaults.store, () => {});
    expect(chrome.runtime.onMessage.hasListeners()).toBe(true);

    expect(sendResponseSpy).not.toHaveBeenCalled();

    chrome.runtime.onMessage.callListeners(
      { type: EventMessage.STORE_GET_STORE },
      {},
      sendResponseSpy
    );

    expect(sendResponseSpy).toHaveBeenCalledTimes(1);
    const response = sendResponseSpy.mock.calls[0][0];
    expect(response).toEqual(defaults.store);

    sendResponseSpy.mockClear();

    chrome.runtime.onMessage.callListeners(
      "invalid-message",
      {},
      sendResponseSpy
    );

    expect(sendResponseSpy).not.toHaveBeenCalled();
  });

  it("should return a store value on STORE_GET", () => {
    expect.assertions(5);
    const sendResponseSpy = jest.fn();
    const store = new Store(defaults.store, () => {});

    expect(sendResponseSpy).not.toHaveBeenCalled();

    chrome.runtime.onMessage.callListeners(
      { type: EventMessage.STORE_GET, payload: "enabled" },
      {},
      sendResponseSpy
    );

    expect(sendResponseSpy).toHaveBeenCalledTimes(1);
    expect(sendResponseSpy).toHaveBeenCalledWith(defaults.store.enabled);

    sendResponseSpy.mockClear();
    store.set({ enabled: false });

    chrome.runtime.onMessage.callListeners(
      { type: EventMessage.STORE_GET, payload: "enabled" },
      {},
      sendResponseSpy
    );

    expect(sendResponseSpy).toHaveBeenCalledTimes(1);
    expect(sendResponseSpy).toHaveBeenCalledWith(false);
  });

  it("should set a new store and publish on STORE_OVERRIDE", () => {
    expect.assertions(5);
    const newState: StoreState = {
      ...defaults.store,
      enabled: false,
      blocking: Blocking.BLACKLIST,
    };
    const store = new Store(defaults.store, () => {});
    expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

    expect(store.getStore()).toEqual(defaults.store);

    chrome.runtime.onMessage.callListeners(
      { type: EventMessage.STORE_OVERRIDE, payload: newState },
      {},
      () => {}
    );

    expect(store.getStore()).toEqual(newState);
    expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
      type: EventMessage.STORE_UPDATED,
      payload: newState,
    });
  });

  it("should set a new store value and publish on STORE_SET", () => {
    expect.assertions(5);
    const store = new Store(defaults.store, () => {});
    expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

    expect(store.getStore()).toEqual(defaults.store);

    chrome.runtime.onMessage.callListeners(
      { type: EventMessage.STORE_SET, payload: { enabled: false } },
      {},
      () => {}
    );

    expect(store.getStore()).toEqual({ ...defaults.store, enabled: false });
    expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
      type: EventMessage.STORE_UPDATED,
      payload: { ...defaults.store, enabled: false },
    });
  });

  it("should call portUpdate on publish, with the script changes", () => {
    expect.assertions(3);
    const mockPortUpdate = jest.fn();
    new Store(defaults.store, mockPortUpdate);
    expect(mockPortUpdate).not.toHaveBeenCalled();

    chrome.runtime.onMessage.callListeners(
      { type: EventMessage.STORE_SET, payload: { blocking: false } },
      {},
      () => {}
    );

    expect(mockPortUpdate).toHaveBeenCalledTimes(1);
    expect(mockPortUpdate).toBeCalledWith([{ blocking: false }, 1]);
  });

  it("should have a getChanges method that returns the last changes", () => {
    expect.assertions(4);

    const store = new Store(defaults.store, () => {});

    expect(store.getChanges()).toEqual([{}, 0]);

    store.set({ enabled: false });

    expect(store.getChanges()).toEqual([{ enabled: false }, 1]);

    store.set({ blocking: Blocking.WHITELIST });

    expect(store.getChanges()).toEqual([{ blocking: Blocking.WHITELIST }, 1]);

    const newState = {
      ...defaults.store,
      blackList: [{ name: "new-test-user", id: "80979" }],
    };

    store.setStore(newState);

    expect(store.getChanges()).toEqual([
      newState,
      Object.keys(newState).length,
    ]);
  });
});
