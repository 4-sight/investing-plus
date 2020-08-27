/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { chrome } from "jest-chrome";
import Popup from "../Popup";
import { mockError, getProperties, defaults } from "../../testHelpers";
import { Blocking } from "../../types";

describe("Popup", () => {
  // Setup
  let actions;

  beforeEach(() => {
    actions = {
      toggleEnabled: jest.fn(),
      switchBlocking: jest.fn(),
    };

    chrome.runtime.sendMessage.mockClear();
  });

  //========================================

  // it("should render without crashing or calling console.error", () => {
  //   expect.assertions(2);

  //   mockError.mock();

  //   expect(console.error).not.toHaveBeenCalled();
  //   render(<Popup />);
  //   expect(console.error).not.toHaveBeenCalled();

  //   mockError.restore();
  // });
  it("should ", () => {});
});
