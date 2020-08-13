/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { chrome } from "jest-chrome";
import Popup from "../Popup";
import useGenStore from "../hooks/useGenStore";
import { mockError, getProperties, defaults } from "../../testHelpers";
import { Blocking } from "../../types";

jest.mock("../hooks/useGenStore");

const mockUseGenStore = (useGenStore as unknown) as jest.Mock;

describe("Popup", () => {
  // Setup
  let actions;

  beforeEach(() => {
    actions = {
      toggleEnabled: jest.fn(),
      switchBlocking: jest.fn(),
    };

    mockUseGenStore.mockClear();
    chrome.runtime.sendMessage.mockClear();

    mockUseGenStore.mockReturnValue([defaults.generalStore, actions]);
  });

  //========================================

  it("should render without crashing or calling console.error", () => {
    expect.assertions(2);

    mockError.mock();

    expect(console.error).not.toHaveBeenCalled();
    render(<Popup />);
    expect(console.error).not.toHaveBeenCalled();

    mockError.restore();
  });

  it("should call useGenStore", () => {
    expect.assertions(2);

    expect(mockUseGenStore).not.toHaveBeenCalled();
    render(<Popup />);
    expect(mockUseGenStore).toHaveBeenCalledTimes(1);
  });

  describe("enabled button", () => {
    it("should display enabled state", () => {
      expect.assertions(6);
      const popup1 = render(<Popup />);
      const enabledButton1 = popup1.getByTestId("toggle-enabled");

      expect(enabledButton1).toBeInstanceOf(HTMLButtonElement);
      expect(
        getProperties(enabledButton1).pendingProps.style.backgroundColor
      ).toEqual("green");
      expect(enabledButton1.textContent).toEqual("Disable");

      popup1.unmount();

      mockUseGenStore.mockImplementation(() => {
        return [
          {
            ...defaults.generalStore,
            enabled: false,
          },
          actions,
        ];
      });
      const popup2 = render(<Popup />);
      const enabledButton2 = popup2.getByTestId("toggle-enabled");

      expect(enabledButton2).toBeInstanceOf(HTMLButtonElement);
      expect(
        getProperties(enabledButton2).pendingProps.style.backgroundColor
      ).toEqual("red");
      expect(enabledButton2.textContent).toEqual("Enable");
    });

    it("should call toggleEnabled", () => {
      expect.assertions(2);

      expect(actions.toggleEnabled).not.toHaveBeenCalled();

      const { getByTestId } = render(<Popup />);
      const toggleEnabled = getByTestId("toggle-enabled");

      fireEvent.click(toggleEnabled);

      expect(actions.toggleEnabled).toHaveBeenCalledTimes(1);
    });
  });

  describe("switchBlocking button", () => {
    it("should display blocking state", () => {
      expect.assertions(6);
      const popup1 = render(<Popup />);
      const switchBlocking1 = popup1.getByTestId("switch-blocking");

      expect(switchBlocking1).toBeInstanceOf(HTMLButtonElement);
      expect(switchBlocking1.textContent).toEqual("Blocking: NONE");

      popup1.unmount();

      mockUseGenStore.mockImplementation(() => {
        return [
          {
            ...defaults.generalStore,
            blocking: Blocking.BLACKLIST,
          },
          actions,
        ];
      });
      const popup2 = render(<Popup />);
      const switchBlocking2 = popup2.getByTestId("switch-blocking");

      expect(switchBlocking2).toBeInstanceOf(HTMLButtonElement);
      expect(switchBlocking2.textContent).toEqual("Blocking: BLACKLIST");

      popup2.unmount();

      mockUseGenStore.mockImplementation(() => {
        return [
          {
            ...defaults.generalStore,
            blocking: Blocking.WHITELIST,
          },
          actions,
        ];
      });
      const popup3 = render(<Popup />);
      const switchBlocking3 = popup3.getByTestId("switch-blocking");

      expect(switchBlocking3).toBeInstanceOf(HTMLButtonElement);
      expect(switchBlocking3.textContent).toEqual("Blocking: WHITELIST");
    });

    it("should call switchBlocking", () => {
      expect.assertions(2);

      expect(actions.switchBlocking).not.toHaveBeenCalled();

      const { getByTestId } = render(<Popup />);
      const switchBlocking = getByTestId("switch-blocking");

      fireEvent.click(switchBlocking);

      expect(actions.switchBlocking).toHaveBeenCalledTimes(1);
    });
  });
});
