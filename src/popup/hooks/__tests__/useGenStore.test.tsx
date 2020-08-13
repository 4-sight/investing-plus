/**
 * @jest-environment jsdom
 */

import { renderHook, act } from "@testing-library/react-hooks";
import useGenStore from "../useGenStore";
import { chrome } from "jest-chrome";
import { EventMessage } from "../../../types";
import { defaults } from "../../../testHelpers";

describe("useGenStore", () => {
  // Setup
  beforeEach(() => {
    chrome.runtime.onMessage.clearListeners();
    chrome.runtime.sendMessage.mockClear();
    chrome.runtime.sendMessage.mockImplementation(({ type, payload }: any) => {
      if (type === EventMessage.POPUP_MOUNTED) {
        return defaults.generalStore;
      }
    });
  });
  //============================================

  it("should add a listener to runtime.onMessage", () => {
    expect.assertions(2);

    expect(chrome.runtime.onMessage.hasListeners()).toBe(false);

    renderHook(() => useGenStore());

    expect(chrome.runtime.onMessage.hasListeners()).toBe(true);
  });

  it("should return the genStore state", () => {
    expect.assertions(1);

    const { result } = renderHook(() => useGenStore());
    expect(result.current[0]).toEqual(defaults.generalStore);
  });

  // Actions
  describe("toggleEnabled", () => {
    it("should sendMessage TOGGLE_ENABLED", () => {
      expect.assertions(4);

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

      const {
        result: {
          current: [store, actions],
        },
      } = renderHook(() => useGenStore());

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);

      act(() => {
        actions.toggleEnabled();
      });

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(2);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: EventMessage.TOGGLE_ENABLED,
      });
    });
  });

  describe("switchBlocking", () => {
    it("should sendMessage SWITCH_BLOCKING", () => {
      expect.assertions(4);

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

      const {
        result: {
          current: [store, actions],
        },
      } = renderHook(() => useGenStore());

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);

      act(() => {
        actions.switchBlocking();
      });

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(2);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: EventMessage.SWITCH_BLOCKING,
      });
    });
  });
});
