/**
 * @jest-environment jsdom
 */

import { renderHook, act } from "@testing-library/react-hooks";
import { useStore } from "../";
import { chrome } from "jest-chrome";
import { EventMessage, Blocking, StoreState } from "../../types";
import { defaults } from "../../testHelpers";
import { UserStore } from "../../Classes";

describe("useStore", () => {
  // Setup

  beforeEach(() => {
    chrome.runtime.onMessage.clearListeners();
    chrome.runtime.sendMessage.mockClear();
  });

  //==========================================

  it("should send message STORE_GET_STORE with a callback", () => {
    expect.assertions(4);

    expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();
    renderHook(() => useStore());
    expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
    expect(chrome.runtime.sendMessage.mock.calls[0][0]).toEqual({
      type: EventMessage.STORE_GET_STORE,
    });
    expect(chrome.runtime.sendMessage.mock.calls[0][1]).toBeInstanceOf(
      Function
    );
  });

  it("should add an onMessage listener", () => {
    expect.assertions(2);

    expect(chrome.runtime.onMessage.hasListeners()).toBe(false);
    renderHook(() => useStore());
    expect(chrome.runtime.onMessage.hasListeners()).toBe(true);
  });

  it("should remove onMessage listener on unmount", () => {
    expect.assertions(2);

    const { unmount } = renderHook(() => useStore());
    expect(chrome.runtime.onMessage.hasListeners()).toBe(true);
    unmount();

    expect(chrome.runtime.onMessage.hasListeners()).toBe(false);
  });

  it("should update store on STORE_UPDATED", () => {
    expect.assertions(2);

    const { result } = renderHook(() => useStore(defaults.store));

    expect(result.current.get("blocking")).toBe(Blocking.NONE);

    act(() => {
      chrome.runtime.onMessage.callListeners(
        {
          type: EventMessage.STORE_UPDATED,
          payload: {
            ...defaults.store,
            blocking: Blocking.BLACKLIST,
          },
        },
        {},
        () => {}
      );
    });

    expect(result.current.get("blocking")).toBe(Blocking.BLACKLIST);
  });

  describe("store.get", () => {
    it("should return the corresponding value from the store", () => {
      expect.assertions(6);

      const { result } = renderHook(() => useStore(defaults.store));
      expect(result.current.get("blocking")).toBe(defaults.store.blocking);
      expect(result.current.get("enabled")).toBe(defaults.store.enabled);
      expect(result.current.get("blackList")).toBe(defaults.store.blackList);

      const newStore = {
        blocking: Blocking.BLACKLIST,
        enabled: false,
        blackList: [
          {
            name: "new-test-user-123",
            id: "123",
          },
        ],
      };

      act(() => {
        chrome.runtime.onMessage.callListeners(
          {
            type: EventMessage.STORE_UPDATED,
            payload: {
              ...defaults.store,
              ...newStore,
            },
          },
          {},
          () => {}
        );
      });

      expect(result.current.get("blocking")).toBe(newStore.blocking);
      expect(result.current.get("enabled")).toBe(newStore.enabled);
      expect(result.current.get("blackList")).toBe(newStore.blackList);
    });
  });

  describe("toggleEnabled", () => {
    it("should call dispatch with !store.enabled", () => {
      expect.assertions(3);

      const { result } = renderHook(() => useStore({ ...defaults.store }));
      expect(result.current.get("enabled")).toBe(defaults.store.enabled);
      chrome.runtime.sendMessage.mockClear();

      act(() => {
        result.current.toggleEnabled();
      });

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: EventMessage.STORE_SET,
        payload: { enabled: !defaults.store.enabled },
      });
    });
  });

  describe("switchBlocking", () => {
    it("should call dispatch with the next blocking state", async () => {
      expect.assertions(9);

      const modes = Object.keys(Blocking).length / 2;

      const hook1 = renderHook((props: StoreState) => useStore(props), {
        initialProps: { ...defaults.store, blocking: 0 },
      });
      expect(hook1.result.current.get("blocking")).toBe(0);
      chrome.runtime.sendMessage.mockClear();

      act(() => {
        hook1.result.current.switchBlocking();
      });

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: EventMessage.STORE_SET,
        payload: { blocking: 1 },
      });

      const hook2 = renderHook((props: StoreState) => useStore(props), {
        initialProps: { ...defaults.store, blocking: 1 },
      });
      expect(hook2.result.current.get("blocking")).toBe(1);
      chrome.runtime.sendMessage.mockClear();

      act(() => {
        hook2.result.current.switchBlocking();
      });

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: EventMessage.STORE_SET,
        payload: { blocking: 2 },
      });

      const hook3 = renderHook((props: StoreState) => useStore(props), {
        initialProps: { ...defaults.store, blocking: modes - 1 },
      });
      expect(hook3.result.current.get("blocking")).toBe(modes - 1);
      chrome.runtime.sendMessage.mockClear();

      act(() => {
        hook3.result.current.switchBlocking();
      });

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: EventMessage.STORE_SET,
        payload: { blocking: 0 },
      });
    });
  });

  describe("blackList", () => {
    it("should return an array of users", () => {
      expect.assertions(1);

      const { result } = renderHook(() => useStore({ ...defaults.store }));

      expect(result.current.blackList()).toEqual(
        defaults.store.blackList.list()
      );
    });
  });

  describe("blackListAddUser", () => {
    it("should call dispatch with the updated blackList (1)", () => {
      expect.assertions(2);

      const newUser = { id: "12234", name: "new-test-user" };
      const { result } = renderHook(() => useStore({ ...defaults.store }));
      const mockBlackList = new UserStore(defaults.store.blackList.list());

      chrome.runtime.sendMessage.mockClear();
      mockBlackList.add(newUser);

      act(() => {
        result.current.blackListAddUser(newUser);
      });

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
      const message = chrome.runtime.sendMessage.mock.calls[0][0] as any;
      expect(message.payload.blackList.list()).toEqual(mockBlackList.list());
    });
  });

  describe("blackListRemoveUser", () => {
    it("should call dispatch with the updated blackList (2)", () => {
      expect.assertions(2);

      const { result } = renderHook(() => useStore({ ...defaults.store }));
      const mockBlackList = new UserStore(defaults.store.blackList.list());

      chrome.runtime.sendMessage.mockClear();
      mockBlackList.remove("1234");

      act(() => {
        result.current.blackListRemoveUser("1234");
      });

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
      const message = chrome.runtime.sendMessage.mock.calls[0][0] as any;
      expect(message.payload.blackList.list()).toEqual(mockBlackList.list());
    });
  });

  describe("blackListUpdateUser", () => {
    it("should call dispatch with the updated blackList (3)", () => {
      expect.assertions(2);

      const { result } = renderHook(() => useStore({ ...defaults.store }));
      const mockBlackList = new UserStore(defaults.store.blackList.list());

      chrome.runtime.sendMessage.mockClear();
      mockBlackList.update("2345", { name: "updated-user-name" });

      act(() => {
        result.current.blackListUpdateUser("2345", {
          name: "updated-user-name",
        });
      });

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
      const message = chrome.runtime.sendMessage.mock.calls[0][0] as any;
      expect(message.payload.blackList.list()).toEqual(mockBlackList.list());
    });
  });

  describe("whiteList", () => {
    it("should return an array of users", () => {
      expect.assertions(1);

      const { result } = renderHook(() => useStore({ ...defaults.store }));

      expect(result.current.whiteList()).toEqual(
        defaults.store.whiteList.list()
      );
    });
  });

  describe("whiteListAddUser", () => {
    it("should call dispatch with the updated WhiteList (1)", () => {
      expect.assertions(2);

      const newUser = { id: "12234", name: "new-test-user" };
      const { result } = renderHook(() => useStore({ ...defaults.store }));
      const mockWhiteList = new UserStore(defaults.store.whiteList.list());

      chrome.runtime.sendMessage.mockClear();
      mockWhiteList.add(newUser);

      act(() => {
        result.current.whiteListAddUser(newUser);
      });

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
      const message = chrome.runtime.sendMessage.mock.calls[0][0] as any;
      expect(message.payload.whiteList.list()).toEqual(mockWhiteList.list());
    });
  });

  describe("whiteListRemoveUser", () => {
    it("should call dispatch with the updated WhiteList (2)", () => {
      expect.assertions(2);

      const { result } = renderHook(() => useStore({ ...defaults.store }));
      const mockWhiteList = new UserStore(defaults.store.whiteList.list());

      chrome.runtime.sendMessage.mockClear();
      mockWhiteList.remove("1234");

      act(() => {
        result.current.whiteListRemoveUser("1234");
      });

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
      const message = chrome.runtime.sendMessage.mock.calls[0][0] as any;
      expect(message.payload.whiteList.list()).toEqual(mockWhiteList.list());
    });
  });

  describe("whiteListUpdateUser", () => {
    it("should call dispatch with the updated WhiteList (3)", () => {
      expect.assertions(2);

      const { result } = renderHook(() => useStore({ ...defaults.store }));
      const mockWhiteList = new UserStore(defaults.store.whiteList.list());

      chrome.runtime.sendMessage.mockClear();
      mockWhiteList.update("2345", { name: "updated-user-name" });

      act(() => {
        result.current.whiteListUpdateUser("2345", {
          name: "updated-user-name",
        });
      });

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
      const message = chrome.runtime.sendMessage.mock.calls[0][0] as any;
      expect(message.payload.whiteList.list()).toEqual(mockWhiteList.list());
    });
  });
});
