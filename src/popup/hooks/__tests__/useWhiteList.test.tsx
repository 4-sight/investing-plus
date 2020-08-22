/**
 * @jest-environment jsdom
 */

import { renderHook, act } from "@testing-library/react-hooks";
import useWhiteList from "../useWhiteList";
import { chrome } from "jest-chrome";
import { EventMessage } from "../../../types";
import { defaults } from "../../../testHelpers";

describe("useWhiteList", () => {
  // Setup
  beforeEach(() => {
    chrome.runtime.onMessage.clearListeners();
    chrome.runtime.sendMessage.mockClear();
    chrome.runtime.sendMessage.mockImplementation(
      ({ type, payload }: any, cb: (res: any) => void) => {
        if (type === EventMessage.GET_WHITELIST) {
          cb(defaults.userList());
        }
      }
    );
  });
  //============================================

  it("should add a listener to runtime.onMessage", () => {
    expect.assertions(2);

    expect(chrome.runtime.onMessage.hasListeners()).toBe(false);

    renderHook(() => useWhiteList());

    expect(chrome.runtime.onMessage.hasListeners()).toBe(true);
  });

  it("should return the whiteList users from GET_WHITELIST", () => {
    expect.assertions(1);

    const { result } = renderHook(() => useWhiteList());
    expect(result.current[0]).toEqual(defaults.userList());
  });

  // Actions
  describe("add", () => {
    it("should sendMessage WHITELIST_ADD, with a user", () => {
      expect.assertions(4);

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

      const testUser = { name: "test-user-name", id: "555-1" };
      const {
        result: {
          current: [store, actions],
        },
      } = renderHook(() => useWhiteList());

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);

      act(() => {
        actions.add(testUser);
      });

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(2);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: EventMessage.WHITELIST_ADD,
        payload: testUser,
      });
    });
  });

  describe("remove", () => {
    it("should sendMessage WHITELIST_REMOVE with a user", () => {
      expect.assertions(4);

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

      const testUser = { name: "test-user-name", id: "555-1" };
      const {
        result: {
          current: [store, actions],
        },
      } = renderHook(() => useWhiteList());

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);

      act(() => {
        actions.remove(testUser);
      });

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(2);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: EventMessage.WHITELIST_REMOVE,
        payload: testUser,
      });
    });
  });

  describe("update", () => {
    it("should sendMessage WHITELIST_UPDATE_USER, with a user and an update", () => {
      expect.assertions(4);

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

      const testUser = { name: "test-user-name", id: "555-1" };
      const update = { name: "update-user-name" };
      const {
        result: {
          current: [store, actions],
        },
      } = renderHook(() => useWhiteList());

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);

      act(() => {
        actions.update(testUser, update);
      });

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(2);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: EventMessage.WHITELIST_UPDATE_USER,
        payload: { user: testUser, update },
      });
    });
  });

  describe("moveToBlackList", () => {
    it("should sendMessage WHITELIST_SWITCH_USER, with a user", () => {
      expect.assertions(4);

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

      const testUser = { name: "test-user-name", id: "555-1" };
      const {
        result: {
          current: [store, actions],
        },
      } = renderHook(() => useWhiteList());

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);

      act(() => {
        actions.moveToBlackList(testUser);
      });

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(2);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: EventMessage.WHITELIST_SWITCH_USER,
        payload: testUser,
      });
    });
  });
});
