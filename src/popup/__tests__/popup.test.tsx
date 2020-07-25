/**
 * @jest-environment jsdom
 */

import React from "react";
import Popup from "../popup";
import { render, fireEvent } from "@testing-library/react";
import { mockError, getProperties } from "../../testHelpers";
import { useStore } from "../../hooks";
import { defaultStore } from "../../constants";

jest.mock("../../hooks/useStore");
const mockUseStore = useStore as jest.Mock;

describe("Popup", () => {
  // Setup
  const defaultProps = {};
  const mockDispatch = jest.fn();
  const mockStore = { ...defaultStore };
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

    let blockingButton1 = popup1.getByTestId("blocking-toggle");

    expect(blockingButton1).toBeInstanceOf(HTMLButtonElement);
    expect(
      getProperties(blockingButton1).pendingProps.className.includes("enabled")
    ).toBe(true);
    expect(
      getProperties(blockingButton1).pendingProps.className.includes("disabled")
    ).toBe(false);

    popup1.unmount();

    mockUseStore.mockReturnValueOnce([
      { ...defaultStore, blocking: false },
      mockDispatch,
    ]);
    const popup2 = render(<Popup {...defaultProps} />);

    let blockingButton2 = popup2.getByTestId("blocking-toggle");

    expect(blockingButton2).toBeInstanceOf(HTMLButtonElement);
    expect(
      getProperties(blockingButton2).pendingProps.className.includes("enabled")
    ).toBe(false);
    expect(
      getProperties(blockingButton2).pendingProps.className.includes("disabled")
    ).toBe(true);
  });

  it("should display a button that toggles blocking", async () => {
    expect.assertions(3);

    const { getByTestId } = render(<Popup {...defaultProps} />);

    let blockingButton = getByTestId("blocking-toggle");

    expect(mockDispatch).not.toHaveBeenCalled();

    // Toggle button
    fireEvent.click(blockingButton);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      blocking: !defaultStore.blocking,
    });
  });
});
