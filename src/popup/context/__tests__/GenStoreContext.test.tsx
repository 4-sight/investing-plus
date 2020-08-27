/**
 * @jest-environment jsdom
 */

import React from "react";
import Consumer, {
  consumerHelpers,
} from "../../../testHelpers/contextConsumer";
import { render, fireEvent } from "@testing-library/react";
import { chrome } from "jest-chrome";

import {
  GenStoreStateProvider,
  useGenStoreState,
  useGenStoreActions,
} from "../GenStoreContext";
import { EventMessage, Blocking } from "../../../types";
import { defaultStores } from "../../../constants";

describe("GenStoreContext", () => {
  // Setup

  beforeEach(() => {
    chrome.runtime.sendMessage.mockClear();
    chrome.runtime.onMessage.clearListeners();
  });
  //=========================================

  it("should call chrome.runtime.sendMessage with POPUP_MOUNTED and a callback", () => {
    expect.assertions(4);

    expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();
    render(
      <GenStoreStateProvider>
        <Consumer
          useContextState={useGenStoreState}
          useContextActions={useGenStoreActions}
        />
      </GenStoreStateProvider>
    );
    expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
    expect(chrome.runtime.sendMessage.mock.calls[0][0]).toEqual({
      type: EventMessage.POPUP_MOUNTED,
    });
    expect(chrome.runtime.sendMessage.mock.calls[0][1]).toBeInstanceOf(
      Function
    );
  });

  it("should add a listener to runtime.onMessage", () => {
    expect.assertions(2);

    expect(chrome.runtime.onMessage.hasListeners()).toBe(false);

    render(
      <GenStoreStateProvider>
        <Consumer
          useContextState={useGenStoreState}
          useContextActions={useGenStoreActions}
        />
      </GenStoreStateProvider>
    );

    expect(chrome.runtime.onMessage.hasListeners()).toBe(true);
  });

  it("should remove the listener on unmount", () => {
    expect.assertions(3);
    expect(chrome.runtime.onMessage.hasListeners()).toBe(false);

    const { unmount } = render(
      <GenStoreStateProvider>
        <Consumer
          useContextState={useGenStoreState}
          useContextActions={useGenStoreActions}
        />
      </GenStoreStateProvider>
    );

    expect(chrome.runtime.onMessage.hasListeners()).toBe(true);

    unmount();

    expect(chrome.runtime.onMessage.hasListeners()).toBe(false);
  });

  describe("useGenStoreState", () => {
    it("should return the current genStore state", () => {
      expect.assertions(Object.keys(defaultStores.generalStore()).length);

      const { queryByText } = render(
        <GenStoreStateProvider>
          <Consumer
            useContextState={useGenStoreState}
            useContextActions={useGenStoreActions}
          />
        </GenStoreStateProvider>
      );

      expect(
        queryByText(`enabled:${defaultStores.generalStore().enabled}`)
      ).toBeTruthy();
      expect(
        queryByText(`blocking:${defaultStores.generalStore().blocking}`)
      ).toBeTruthy();
      expect(
        queryByText(
          `highlightBlocked:${defaultStores.generalStore().highlightBlocked}`
        )
      ).toBeTruthy();
      expect(
        queryByText(
          `highlightFavourite:${
            defaultStores.generalStore().highlightFavourite
          }`
        )
      ).toBeTruthy();
    });
  });

  describe("useGenStoreActions", () => {
    describe("toggleEnabled", () => {
      it("should call runtime.sendMessage: TOGGLE_ENABLED", () => {
        expect.assertions(3);
        const { getByTestId } = render(
          <GenStoreStateProvider>
            <Consumer
              useContextState={useGenStoreState}
              useContextActions={useGenStoreActions}
            />
          </GenStoreStateProvider>
        );
        chrome.runtime.sendMessage.mockClear();

        expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

        fireEvent.click(getByTestId("toggleEnabled"));

        expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
        expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
          type: EventMessage.TOGGLE_ENABLED,
        });
      });
    });

    describe("toggleHighlightBlocked", () => {
      it("should call runtime.sendMessage: TOGGLE_HIGHLIGHT_BLOCKED", () => {
        expect.assertions(3);
        const { getByTestId } = render(
          <GenStoreStateProvider>
            <Consumer
              useContextState={useGenStoreState}
              useContextActions={useGenStoreActions}
            />
          </GenStoreStateProvider>
        );
        chrome.runtime.sendMessage.mockClear();

        expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

        fireEvent.click(getByTestId("toggleHighlightBlocked"));

        expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
        expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
          type: EventMessage.TOGGLE_HIGHLIGHT_BLOCKED,
        });
      });
    });

    describe("toggleHighlightFavourite", () => {
      it("should call runtime.sendMessage: TOGGLE_HIGHLIGHT_FAVOURITE", () => {
        expect.assertions(3);
        const { getByTestId } = render(
          <GenStoreStateProvider>
            <Consumer
              useContextState={useGenStoreState}
              useContextActions={useGenStoreActions}
            />
          </GenStoreStateProvider>
        );
        chrome.runtime.sendMessage.mockClear();

        expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

        fireEvent.click(getByTestId("toggleHighlightFavourite"));

        expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
        expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
          type: EventMessage.TOGGLE_HIGHLIGHT_FAVOURITE,
        });
      });
    });

    describe("setBlocking", () => {
      it("should call runtime.sendMessage: SET_BLOCKING with payload: blockingMode ", () => {
        expect.assertions(5);

        const { getByTestId } = render(
          <GenStoreStateProvider>
            <Consumer
              useContextState={useGenStoreState}
              useContextActions={useGenStoreActions}
            />
          </GenStoreStateProvider>
        );
        chrome.runtime.sendMessage.mockClear();

        expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

        consumerHelpers.setArgs("Off");
        fireEvent.click(getByTestId("setBlocking"));

        expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
        expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
          type: EventMessage.SET_BLOCKING,
          payload: Blocking.NONE,
        });

        consumerHelpers.clearArgs();
        consumerHelpers.setArgs("Hide Blocked");
        fireEvent.click(getByTestId("setBlocking"));

        expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(2);
        expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
          type: EventMessage.SET_BLOCKING,
          payload: Blocking.BLACKLIST,
        });
      });
    });
  });
});
