import { runtimeListener } from "..";
import {
  linkToContentScript,
  toggleEnabled,
  toggleHighlightBlocked,
  toggleHighlightFavourite,
  setBlocking,
  addToWhiteList,
  removeFromWhiteList,
  updateWhiteListUser,
  switchWhiteListUser,
  addToBlackList,
  removeFromBlackList,
  updateBlackListUser,
  switchBlackListUser,
  blackList,
  whiteList,
  generalStore,
} from "../../eventPage";
import { GeneralStore, UsersStore } from "../../Classes";
import { defaults } from "../../../testHelpers";
import { EventMessage, Blocking } from "../../../types";

jest.mock("../../eventPage", () => {
  const {
    generalStore: _generalStore,
    blackList: _blackList,
    whiteList: _whiteList,
  } = jest.requireActual("../../eventPage");

  return {
    linkToContentScript: jest.fn(),
    toggleEnabled: jest.fn(),
    toggleHighlightBlocked: jest.fn(),
    toggleHighlightFavourite: jest.fn(),
    setBlocking: jest.fn(),
    addToBlackList: jest.fn(),
    removeFromBlackList: jest.fn(),
    updateBlackListUser: jest.fn(),
    switchBlackListUser: jest.fn(),
    addToWhiteList: jest.fn(),
    removeFromWhiteList: jest.fn(),
    updateWhiteListUser: jest.fn(),
    switchWhiteListUser: jest.fn(),
    generalStore: _generalStore,
    blackList: _blackList,
    whiteList: _whiteList,
  };
});

const mockLinkToContentScript = (linkToContentScript as unknown) as jest.Mock;
const mockToggleEnabled = (toggleEnabled as unknown) as jest.Mock;
const mockToggleHighlightBlocked = (toggleHighlightBlocked as unknown) as jest.Mock;
const mockToggleHighlightFavourite = (toggleHighlightFavourite as unknown) as jest.Mock;
const mockSetBlocking = (setBlocking as unknown) as jest.Mock;
const mockAddToBlackList = (addToBlackList as unknown) as jest.Mock;
const mockRemoveFromBlackList = (removeFromBlackList as unknown) as jest.Mock;
const mockUpdateBlackListUser = (updateBlackListUser as unknown) as jest.Mock;
const mockSwitchBlackListUser = (switchBlackListUser as unknown) as jest.Mock;
const mockAddToWhiteList = (addToWhiteList as unknown) as jest.Mock;
const mockRemoveFromWhiteList = (removeFromWhiteList as unknown) as jest.Mock;
const mockUpdateWhiteListUser = (updateWhiteListUser as unknown) as jest.Mock;
const mockSwitchWhiteListUser = (switchWhiteListUser as unknown) as jest.Mock;

describe("runtimeListener", () => {
  // Setup

  let listener = runtimeListener();

  beforeEach(() => {
    mockLinkToContentScript.mockClear();
    mockToggleEnabled.mockClear();
    mockToggleHighlightBlocked.mockClear();
    mockToggleHighlightFavourite.mockClear();
    mockSetBlocking.mockClear();
    mockAddToBlackList.mockClear();
    mockRemoveFromBlackList.mockClear();
    mockUpdateBlackListUser.mockClear();
    mockSwitchBlackListUser.mockClear();
    mockAddToWhiteList.mockClear();
    mockRemoveFromWhiteList.mockClear();
    mockUpdateWhiteListUser.mockClear();
    mockSwitchWhiteListUser.mockClear();
  });

  //====================================
  // MESSAGES

  describe("CONTENT_SCRIPT_MOUNTED", () => {
    it("should call linkToContentScript with the sender tab", () => {
      expect.assertions(3);

      const mockTab = {
        id: 1234,
      } as any;
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
      } as any;
      let returnedState;

      listener(
        { type: EventMessage.POPUP_MOUNTED },
        { tab: mockTab },
        (state) => {
          returnedState = state;
        }
      );

      expect(returnedState).toEqual(generalStore.getState());
    });
  });

  describe("GET_BLACKLIST", () => {
    it("should return current blackList users", () => {
      expect.assertions(1);

      const mockTab = {
        id: 12345,
      } as any;
      let blackListUsers;

      listener(
        { type: EventMessage.GET_BLACKLIST },
        { tab: mockTab },
        (users) => {
          blackListUsers = users;
        }
      );

      expect(blackListUsers).toEqual(blackList.getUsers());
    });
  });

  describe("GET_WHITELIST", () => {
    it("should return current whiteList users", () => {
      expect.assertions(1);

      const mockTab = {
        id: 12345,
      } as any;
      let whiteListUsers;

      listener(
        { type: EventMessage.GET_WHITELIST },
        { tab: mockTab },
        (users) => {
          whiteListUsers = users;
        }
      );

      expect(whiteListUsers).toEqual(whiteList.getUsers());
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

  describe("SET_BLOCKING", () => {
    it("should call setBlocking, with the payload", () => {
      expect.assertions(3);

      expect(mockSetBlocking).not.toHaveBeenCalled();

      listener(
        {
          type: EventMessage.SET_BLOCKING,
          payload: Blocking.BLACKLIST,
        },
        {},
        () => {}
      );

      expect(mockSetBlocking).toHaveBeenCalledTimes(1);
      expect(mockSetBlocking).toHaveBeenCalledWith(Blocking.BLACKLIST);
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

  describe("BLACKLIST_UPDATE_USER", () => {
    it("should call updateBlackListUser, with the payload", () => {
      expect.assertions(3);

      expect(mockUpdateBlackListUser).not.toHaveBeenCalled();

      const user = { name: "test-user-name", id: "test-user-id" };
      const update = { name: "update-user-name" };
      listener(
        {
          type: EventMessage.BLACKLIST_UPDATE_USER,
          payload: { user, update },
        },
        {},
        () => {}
      );

      expect(mockUpdateBlackListUser).toHaveBeenCalledTimes(1);
      expect(mockUpdateBlackListUser).toHaveBeenCalledWith(user, update);
    });
  });

  describe("BLACKLIST_SWITCH_USER", () => {
    it("should call switchBlackListUser, with the payload", () => {
      expect.assertions(3);

      expect(mockSwitchBlackListUser).not.toHaveBeenCalled();

      const user = { name: "test-user-name", id: "test-user-id" };
      listener(
        {
          type: EventMessage.BLACKLIST_SWITCH_USER,
          payload: user,
        },
        {},
        () => {}
      );

      expect(mockSwitchBlackListUser).toHaveBeenCalledTimes(1);
      expect(mockSwitchBlackListUser).toHaveBeenCalledWith(user);
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

  describe("WHITELIST_UPDATE_USER", () => {
    it("should call updateWhiteListUser, with the payload", () => {
      expect.assertions(3);

      expect(mockUpdateWhiteListUser).not.toHaveBeenCalled();

      const user = { name: "test-user-name", id: "test-user-id" };
      const update = { name: "update-user-name" };
      listener(
        {
          type: EventMessage.WHITELIST_UPDATE_USER,
          payload: { user, update },
        },
        {},
        () => {}
      );

      expect(mockUpdateWhiteListUser).toHaveBeenCalledTimes(1);
      expect(mockUpdateWhiteListUser).toHaveBeenCalledWith(user, update);
    });
  });

  describe("WHITELIST_SWITCH_USER", () => {
    it("should call switchWhiteListUser, with the payload", () => {
      expect.assertions(3);

      expect(mockSwitchWhiteListUser).not.toHaveBeenCalled();

      const user = { name: "test-user-name", id: "test-user-id" };
      listener(
        {
          type: EventMessage.WHITELIST_SWITCH_USER,
          payload: user,
        },
        {},
        () => {}
      );

      expect(mockSwitchWhiteListUser).toHaveBeenCalledTimes(1);
      expect(mockSwitchWhiteListUser).toHaveBeenCalledWith(user);
    });
  });
});
