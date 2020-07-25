import { Store } from "../Store";
import { EventMessage, StoreState } from "../../types";
import { chrome } from "jest-chrome";
import { defaultStore } from "../../constants";

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
    let s = new Store(defaultStore);
    expect(s).toBeInstanceOf(Store);
  });

  it("should have a getStore method that returns the store state", () => {
    expect.assertions(1);
    let store = new Store(defaultStore);

    expect(store.getStore()).toEqual(defaultStore);
  });

  it("should have a setStore method that overrides the store state", () => {
    expect.assertions(2);
    const newState: StoreState = {
      ...defaultStore,
      enabled: false,
      blocking: false,
    };

    let store = new Store(defaultStore);

    expect(store.getStore()).toEqual(defaultStore);
    store.setStore(newState);
    expect(store.getStore()).toEqual(newState);
  });

  it("should have a get method that returns a store state value", () => {
    expect.assertions(1);
    const store = new Store(defaultStore);

    expect(store.get("enabled")).toEqual(defaultStore.enabled);
  });

  it("should have a set method that sets a value in store state", () => {
    expect.assertions(2);
    const store = new Store(defaultStore);

    expect(store.get("enabled")).toEqual(defaultStore.enabled);
    store.set({ enabled: false });
    expect(store.get("enabled")).toEqual(false);
  });

  it("should publish the new store state on change", () => {
    expect.assertions(4);
    expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();
    const store = new Store(defaultStore);

    expect(store.get("enabled")).toEqual(defaultStore.enabled);
    store.set({ enabled: false });
    expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
      type: EventMessage.STORE_UPDATED,
      payload: { ...defaultStore, enabled: false },
    });
  });

  it("should set sync storage on update", () => {
    expect.assertions(4);
    expect(chrome.storage.sync.set).not.toHaveBeenCalled();
    const store = new Store(defaultStore);
    expect(chrome.storage.sync.set).not.toHaveBeenCalled();

    store.set({ enabled: false });
    expect(chrome.storage.sync.set).toHaveBeenCalled();
    expect(chrome.storage.sync.set).toHaveBeenCalledWith({
      store: { ...defaultStore, enabled: false },
    });
  });

  it("should sync with sync storage on creation", () => {
    expect.assertions(7);
    const syncStore: StoreState = {
      ...defaultStore,
      enabled: false,
      blocking: false,
    };

    chrome.storage.sync.get.mockImplementationOnce((key, cb) => {
      cb({});
    });

    expect(chrome.storage.sync.get).not.toHaveBeenCalled();
    expect(chrome.storage.sync.set).not.toHaveBeenCalled();

    const store1 = new Store(defaultStore);
    expect(store1.getStore()).toEqual(defaultStore);
    expect(chrome.storage.sync.set).toHaveBeenCalled();
    expect(chrome.storage.sync.set).toHaveBeenCalledWith({
      store: defaultStore,
    });

    chrome.storage.sync.get.mockImplementationOnce((key, cb) => {
      cb({ store: syncStore });
    });

    const store2 = new Store(defaultStore);
    expect(store2.getStore()).not.toEqual(defaultStore);
    expect(store2.getStore()).toEqual(syncStore);
  });

  it("should receive updated state from sync storage", () => {
    expect.assertions(4);
    const syncStore: StoreState = {
      ...defaultStore,
      enabled: false,
      blocking: false,
    };

    expect(chrome.storage.onChanged.hasListeners()).toBe(false);
    const store = new Store(defaultStore);
    expect(chrome.storage.onChanged.hasListeners()).toBe(true);
    expect(store.getStore()).toEqual(defaultStore);

    chrome.storage.onChanged.callListeners(
      { store: { oldValue: defaultStore, newValue: syncStore } },
      "test"
    );

    expect(store.getStore()).toEqual(syncStore);
  });

  it("should return a store on STORE_GET_STORE", () => {
    expect.assertions(6);
    const sendResponseSpy = jest.fn();

    expect(chrome.runtime.onMessage.hasListeners()).toBe(false);
    new Store(defaultStore);
    expect(chrome.runtime.onMessage.hasListeners()).toBe(true);

    expect(sendResponseSpy).not.toHaveBeenCalled();

    chrome.runtime.onMessage.callListeners(
      { type: EventMessage.STORE_GET_STORE },
      {},
      sendResponseSpy
    );

    expect(sendResponseSpy).toHaveBeenCalledTimes(1);
    const response = sendResponseSpy.mock.calls[0][0];
    expect(response).toEqual(defaultStore);

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
    const store = new Store(defaultStore);

    expect(sendResponseSpy).not.toHaveBeenCalled();

    chrome.runtime.onMessage.callListeners(
      { type: EventMessage.STORE_GET, payload: "enabled" },
      {},
      sendResponseSpy
    );

    expect(sendResponseSpy).toHaveBeenCalledTimes(1);
    expect(sendResponseSpy).toHaveBeenCalledWith(defaultStore.enabled);

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
      ...defaultStore,
      enabled: false,
      blocking: false,
    };
    const store = new Store(defaultStore);
    expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

    expect(store.getStore()).toEqual(defaultStore);

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
    const store = new Store(defaultStore);
    expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

    expect(store.getStore()).toEqual(defaultStore);

    chrome.runtime.onMessage.callListeners(
      { type: EventMessage.STORE_SET, payload: { enabled: false } },
      {},
      () => {}
    );

    expect(store.getStore()).toEqual({ ...defaultStore, enabled: false });
    expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
      type: EventMessage.STORE_UPDATED,
      payload: { ...defaultStore, enabled: false },
    });
  });
});
