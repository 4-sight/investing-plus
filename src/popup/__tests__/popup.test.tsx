/**
 * @jest-environment jsdom
 */

import React from "react";
import Popup from "../popup";
import { render, fireEvent } from "@testing-library/react";
import { mockError, getProperties } from "../../testHelpers";
import { useStore } from "../../hooks";
import { defaults } from "../../testHelpers";
import { Blocking } from "../../types";

jest.mock("../../hooks/useStore");
const mockUseStore = useStore as jest.Mock;

describe("Popup", () => {
  // Setup
  const defaultProps = {};
  const mockDispatch = jest.fn();
  const mockStore = { ...defaults.store };
  mockUseStore.mockReturnValue([mockStore, mockDispatch]);

  beforeEach(() => {
    mockDispatch.mockClear();
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

  it("should display a button that shows blocking state", () => {
    expect.assertions(6);
    const popup1 = render(<Popup {...defaultProps} />);

    let blockingButton1 = popup1.getByTestId("blocking-switch");

    expect(blockingButton1).toBeInstanceOf(HTMLButtonElement);
    expect(blockingButton1.textContent).toEqual("Blocking: NONE");

    popup1.unmount();

    mockUseStore.mockReturnValueOnce([
      { ...defaults.store, blocking: Blocking.BLACKLIST },
      mockDispatch,
    ]);
    const popup2 = render(<Popup {...defaultProps} />);

    let blockingButton2 = popup2.getByTestId("blocking-switch");

    expect(blockingButton2).toBeInstanceOf(HTMLButtonElement);
    expect(blockingButton2.textContent).toEqual("Blocking: BLACKLIST");

    popup2.unmount();

    mockUseStore.mockReturnValueOnce([
      { ...defaults.store, blocking: Blocking.WHITELIST },
      mockDispatch,
    ]);
    render(<Popup {...defaultProps} />);

    let blockingButton3 = popup2.getByTestId("blocking-switch");

    expect(blockingButton3).toBeInstanceOf(HTMLButtonElement);
    expect(blockingButton3.textContent).toEqual("Blocking: WHITELIST");
  });

  it("should display a button that switches blocking", async () => {
    expect.assertions(3);

    const { getByTestId } = render(<Popup {...defaultProps} />);

    let blockingButton = getByTestId("blocking-switch");

    expect(mockDispatch).not.toHaveBeenCalled();

    // Toggle button
    fireEvent.click(blockingButton);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      blocking: (defaults.store.blocking + 4) % 3,
    });
  });
});
