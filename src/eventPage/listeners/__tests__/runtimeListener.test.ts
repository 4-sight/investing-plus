import { runtimeListener } from "..";
import {
  linkToContentScript,
  toggleEnabled,
  switchBlocking,
} from "../../eventPage";
import { GeneralStore } from "../../Classes";
import { defaults } from "../../../testHelpers";
import { EventMessage } from "../../../types";

jest.mock("../../eventPage", () => ({
  linkToContentScript: jest.fn(),
  toggleEnabled: jest.fn(),
  switchBlocking: jest.fn(),
}));

const mockLinkToContentScript = (linkToContentScript as unknown) as jest.Mock;
const mockToggleEnabled = (toggleEnabled as unknown) as jest.Mock;
const mockSwitchBlocking = (switchBlocking as unknown) as jest.Mock;

describe("runtimeListener", () => {
  // Setup

  let mockGenStore: GeneralStore;

  let listener;

  beforeEach(() => {
    mockLinkToContentScript.mockClear();
    mockToggleEnabled.mockClear();
    mockSwitchBlocking.mockClear();
    mockGenStore = new GeneralStore(defaults.generalStore);

    listener = runtimeListener(mockGenStore);
  });

  //====================================
  // MESSAGES

  describe("CONTENT_SCRIPT_MOUNTED", () => {
    it("should call linkToContentScript with the sender tab", () => {
      expect.assertions(3);

      const mockTab = {
        id: 1234,
      };
      expect(mockLinkToContentScript).not.toHaveBeenCalled();

      listener(
        {
          type: EventMessage.CONTENT_SCRIPT_MOUNTED,
        },
        {
          tab: mockTab,
        },
        () => {}
      );

      expect(mockLinkToContentScript).toHaveBeenCalledTimes(1);
      expect(mockLinkToContentScript).toHaveBeenCalledWith(mockTab);
    });
  });

  describe("POPUP_MOUNTED", () => {
    it("should return genStore state", () => {
      expect.assertions(1);

      const mockTab = {
        id: 12345,
      };
      let returnedState;

      listener(
        { type: EventMessage.POPUP_MOUNTED },
        { tab: mockTab },
        (state) => {
          returnedState = state;
        }
      );

      expect(returnedState).toEqual(mockGenStore.getState());
    });
  });

  describe("TOGGLE_ENABLED", () => {
    it("should call toggleEnabled", () => {
      expect.assertions(2);

      expect(mockToggleEnabled).not.toHaveBeenCalled();

      listener(
        {
          type: EventMessage.TOGGLE_ENABLED,
        },
        {},
        () => {}
      );

      expect(mockToggleEnabled).toHaveBeenCalledTimes(1);
    });
  });

  describe("SWITCH_BLOCKING", () => {
    it("should call switchBlocking", () => {
      expect.assertions(2);

      expect(mockSwitchBlocking).not.toHaveBeenCalled();

      listener(
        {
          type: EventMessage.SWITCH_BLOCKING,
        },
        {},
        () => {}
      );

      expect(mockSwitchBlocking).toHaveBeenCalledTimes(1);
    });
  });
});
