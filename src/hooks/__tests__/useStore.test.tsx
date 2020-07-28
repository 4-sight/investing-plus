/**
 * @jest-environment jsdom
 */

import { renderHook, act } from "@testing-library/react-hooks";
import { useStore } from "../";
import { chrome } from "jest-chrome";
import { EventMessage, Blocking } from "../../types";
import { defaults } from "../../testHelpers";

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

  it("should return the store and a dispatch function", () => {
    expect.assertions(2);

    const { result } = renderHook(() => useStore(defaults.store));

    expect(result.current[0]).toEqual(defaults.store);
    expect(result.current[1]).toBeInstanceOf(Function);
  });

  it("should call STORE_SET on dispatch with a payload", () => {
    expect.assertions(3);

    const {
      result: {
        current: [_, dispatch],
      },
    } = renderHook(() => useStore(defaults.store));

    expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
    dispatch({ blocking: Blocking.WHITELIST });
    expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(2);
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
      type: EventMessage.STORE_SET,
      payload: { blocking: Blocking.WHITELIST },
    });
  });

  it("should update store on STORE_UPDATED", () => {
    expect.assertions(2);

    const { result } = renderHook(() => useStore(defaults.store));

    expect(result.current[0].blocking).toBe(Blocking.NONE);

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

    expect(result.current[0].blocking).toBe(Blocking.BLACKLIST);
  });
});
