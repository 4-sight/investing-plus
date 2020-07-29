/**
 * @jest-environment jsdom
 */

import React from "react";
import Popup from "../popup";
import { render, fireEvent } from "@testing-library/react";
import { mockError, getProperties } from "../../testHelpers";
import { useStore } from "../../hooks";
import { defaults } from "../../testHelpers";
import { Blocking, UseStore, StoreState } from "../../types";

jest.mock("../../hooks/useStore");
const mockUseStore = useStore as jest.Mock;
let store;

describe("Popup", () => {
  // Setup
  const defaultProps = {};

  beforeEach(() => {
    store = {
      get: jest.fn((key: keyof StoreState) => defaults.store[key]),
      toggleEnabled: jest.fn(),
      switchBlocking: jest.fn(),
    };

    mockUseStore.mockReturnValue(store);
  });

  //==========================================

  it("should render without crashing or calling console.error", () => {
    expect.assertions(2);
    mockError.mock();
    expect(console.error).not.toHaveBeenCalled();

    render(<Popup {...defaultProps} />);

    expect(console.error).not.toHaveBeenCalled();
    mockError.restore();
  });

  it("should display a button that shows enabled state", () => {
    expect.assertions(4);
    const popup1 = render(<Popup {...defaultProps} />);

    let enabledButton1 = popup1.getByTestId("toggle-enabled");

    expect(enabledButton1).toBeInstanceOf(HTMLButtonElement);
    expect(
      getProperties(enabledButton1).pendingProps.style.backgroundColor
    ).toEqual("green");

    popup1.unmount();

    store.get.mockImplementation((k: keyof StoreState) => {
      if (k === "enabled") return false;
      else return defaults.store[k];
    });
    const popup2 = render(<Popup {...defaultProps} />);

    let enabledButton2 = popup2.getByTestId("toggle-enabled");

    expect(enabledButton2).toBeInstanceOf(HTMLButtonElement);
    expect(
      getProperties(enabledButton2).pendingProps.style.backgroundColor
    ).toEqual("red");
  });

  it("should display a button that calls store.toggleEnabled", () => {
    expect.assertions(2);

    const { getByTestId } = render(<Popup {...defaultProps} />);

    let button = getByTestId("toggle-enabled");

    expect(store.toggleEnabled).not.toHaveBeenCalled();

    // Toggle button
    fireEvent.click(button);

    expect(store.toggleEnabled).toHaveBeenCalledTimes(1);
  });

  it("should display a button that shows blocking state", () => {
    expect.assertions(6);
    const popup1 = render(<Popup {...defaultProps} />);

    let blockingButton1 = popup1.getByTestId("blocking-switch");

    expect(blockingButton1).toBeInstanceOf(HTMLButtonElement);
    expect(blockingButton1.textContent).toEqual("Blocking: NONE");

    popup1.unmount();

    store.get.mockImplementation((k: keyof StoreState) => {
      if (k === "blocking") return Blocking.BLACKLIST;
      else return defaults.store[k];
    });
    const popup2 = render(<Popup {...defaultProps} />);

    let blockingButton2 = popup2.getByTestId("blocking-switch");

    expect(blockingButton2).toBeInstanceOf(HTMLButtonElement);
    expect(blockingButton2.textContent).toEqual("Blocking: BLACKLIST");

    popup2.unmount();

    store.get.mockImplementation((k: keyof StoreState) => {
      if (k === "blocking") return Blocking.WHITELIST;
      else return defaults.store[k];
    });
    render(<Popup {...defaultProps} />);

    let blockingButton3 = popup2.getByTestId("blocking-switch");

    expect(blockingButton3).toBeInstanceOf(HTMLButtonElement);
    expect(blockingButton3.textContent).toEqual("Blocking: WHITELIST");
  });

  it("should display a button that calls store.switchBlocking", async () => {
    expect.assertions(2);

    const { getByTestId } = render(<Popup {...defaultProps} />);

    let button = getByTestId("blocking-switch");

    expect(store.switchBlocking).not.toHaveBeenCalled();

    // Toggle button
    fireEvent.click(button);

    expect(store.switchBlocking).toHaveBeenCalledTimes(1);
  });
});
