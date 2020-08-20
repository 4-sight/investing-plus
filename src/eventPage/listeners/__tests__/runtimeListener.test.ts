import { runtimeListener } from "..";
import {
  linkToContentScript,
  toggleEnabled,
  toggleHighlightBlocked,
  toggleHighlightFavourite,
  switchBlocking,
  addToWhiteList,
  removeFromWhiteList,
  addToBlackList,
  removeFromBlackList,
} from "../../eventPage";
import { GeneralStore } from "../../Classes";
import { defaults } from "../../../testHelpers";
import { EventMessage } from "../../../types";

jest.mock("../../eventPage", () => ({
  linkToContentScript: jest.fn(),
  toggleEnabled: jest.fn(),
  toggleHighlightBlocked: jest.fn(),
  toggleHighlightFavourite: jest.fn(),
  switchBlocking: jest.fn(),
  addToBlackList: jest.fn(),
  removeFromBlackList: jest.fn(),
  addToWhiteList: jest.fn(),
  removeFromWhiteList: jest.fn(),
}));

const mockLinkToContentScript = (linkToContentScript as unknown) as jest.Mock;
const mockToggleEnabled = (toggleEnabled as unknown) as jest.Mock;
const mockToggleHighlightBlocked = (toggleHighlightBlocked as unknown) as jest.Mock;
const mockToggleHighlightFavourite = (toggleHighlightFavourite as unknown) as jest.Mock;
const mockSwitchBlocking = (switchBlocking as unknown) as jest.Mock;
const mockAddToBlackList = (addToBlackList as unknown) as jest.Mock;
const mockRemoveFromBlackList = (removeFromBlackList as unknown) as jest.Mock;
const mockAddToWhiteList = (addToWhiteList as unknown) as jest.Mock;
const mockRemoveFromWhiteList = (removeFromWhiteList as unknown) as jest.Mock;

describe("runtimeListener", () => {
  // Setup

  let mockGenStore: GeneralStore;

  let listener;

  beforeEach(() => {
    mockLinkToContentScript.mockClear();
    mockToggleEnabled.mockClear();
    mockToggleHighlightBlocked.mockClear();
    mockToggleHighlightFavourite.mockClear();
    mockSwitchBlocking.mockClear();
    mockAddToBlackList.mockClear();
    mockRemoveFromBlackList.mockClear();
    mockAddToWhiteList.mockClear();
    mockRemoveFromWhiteList.mockClear();
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

  describe("TOGGLE_HIGHLIGHT_BLOCKED", () => {
    it("should call toggleHighlightBlocked", () => {
      expect.assertions(2);

      expect(mockToggleHighlightBlocked).not.toHaveBeenCalled();

      listener(
        {
          type: EventMessage.TOGGLE_HIGHLIGHT_BLOCKED,
        },
        {},
        () => {}
      );

      expect(mockToggleHighlightBlocked).toHaveBeenCalledTimes(1);
    });
  });

  describe("TOGGLE_HIGHLIGHT_FAVOURITE", () => {
    it("should call toggleHighlightFavourite", () => {
      expect.assertions(2);

      expect(mockToggleHighlightFavourite).not.toHaveBeenCalled();

      listener(
        {
          type: EventMessage.TOGGLE_HIGHLIGHT_FAVOURITE,
        },
        {},
        () => {}
      );

      expect(mockToggleHighlightFavourite).toHaveBeenCalledTimes(1);
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

  describe("BLACKLIST_ADD", () => {
    it("should call addToBlackList, with the payload", () => {
      expect.assertions(3);

      expect(mockAddToBlackList).not.toHaveBeenCalled();

      const user = { name: "test-user-name", id: "test-user-id" };
      listener(
        {
          type: EventMessage.BLACKLIST_ADD,
          payload: user,
        },
        {},
        () => {}
      );

      expect(mockAddToBlackList).toHaveBeenCalledTimes(1);
      expect(mockAddToBlackList).toHaveBeenCalledWith(user);
    });
  });

  describe("BLACKLIST_REMOVE", () => {
    it("should call removeFromBlackList, with the payload", () => {
      expect.assertions(3);

      expect(mockRemoveFromBlackList).not.toHaveBeenCalled();

      const user = { name: "test-user-name", id: "test-user-id" };
      listener(
        {
          type: EventMessage.BLACKLIST_REMOVE,
          payload: user,
        },
        {},
        () => {}
      );

      expect(mockRemoveFromBlackList).toHaveBeenCalledTimes(1);
      expect(mockRemoveFromBlackList).toHaveBeenCalledWith(user);
    });
  });

  describe("WHITELIST_ADD", () => {
    it("should call addToWhiteList, with the payload", () => {
      expect.assertions(3);

      expect(mockAddToWhiteList).not.toHaveBeenCalled();

      const user = { name: "test-user-name", id: "test-user-id" };
      listener(
        {
          type: EventMessage.WHITELIST_ADD,
          payload: user,
        },
        {},
        () => {}
      );

      expect(mockAddToWhiteList).toHaveBeenCalledTimes(1);
      expect(mockAddToWhiteList).toHaveBeenCalledWith(user);
    });
  });

  describe("WHITELIST_REMOVE", () => {
    it("should call removeFromWhiteList, with the payload", () => {
      expect.assertions(3);

      expect(mockRemoveFromWhiteList).not.toHaveBeenCalled();

      const user = { name: "test-user-name", id: "test-user-id" };
      listener(
        {
          type: EventMessage.WHITELIST_REMOVE,
          payload: user,
        },
        {},
        () => {}
      );

      expect(mockRemoveFromWhiteList).toHaveBeenCalledTimes(1);
      expect(mockRemoveFromWhiteList).toHaveBeenCalledWith(user);
    });
  });
});
