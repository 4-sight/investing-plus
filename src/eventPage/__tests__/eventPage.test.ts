import { chrome } from "jest-chrome";
import {
  generalStore,
  blackList,
  whiteList,
  styles,
  sendRuntimeMessage,
  updateChromeStorage,
  syncChromeStorage,
  linkToContentScript,
  toggleEnabled,
  toggleHighlightBlocked,
  toggleHighlightFavourite,
  setBlocking,
  addToBlackList,
  removeFromBlackList,
  updateBlackListUser,
  switchBlackListUser,
  addToWhiteList,
  removeFromWhiteList,
  updateWhiteListUser,
  switchWhiteListUser,
  addRuntimeListener,
  addStorageListener,
  initializeEventPage,
  updateStyles,
  updatePorts,
  portHandlers,
} from "../eventPage";
import * as eventPageFunctions from "../eventPage";
import { EventMessage, Blocking, GeneralStoreState, Users } from "../../types";
import { defaults } from "../../testHelpers";
import * as PortHandlerModule from "../Classes/PortHandler";
import * as runtimeListenerModule from "../listeners/runtimeListener";
import * as syncListenerModule from "../listeners/syncListener";

jest.mock("../Classes/PortHandler", () => ({
  PortHandler: jest.fn(),
}));

jest.mock("../listeners/runtimeListener", () => ({
  runtimeListener: jest.fn(),
}));

jest.mock("../listeners/syncListener", () => ({
  syncListener: jest.fn(),
}));

const mockPortHandlerModule = PortHandlerModule as {
  PortHandler: jest.Mock;
};
const mockRuntimeListenerModule = (runtimeListenerModule as unknown) as {
  runtimeListener: jest.Mock;
};
const mockSyncListenerModule = (syncListenerModule as unknown) as {
  syncListener: jest.Mock;
};

describe("eventPage", () => {
  // Setup
  const mockInitialize = jest.fn();
  const mockPortHandler = {
    initialize: mockInitialize,
    disable: jest.fn(),
    enable: jest.fn(),
    sendStyleRules: jest.fn(),
  };

  beforeEach(() => {
    mockRuntimeListenerModule.runtimeListener.mockClear();
    mockSyncListenerModule.syncListener.mockClear();
    mockInitialize.mockClear();
    mockPortHandlerModule.PortHandler.mockClear();
    mockPortHandlerModule.PortHandler.mockImplementation(() => mockPortHandler);
    generalStore.setState(defaults.generalStore);
    whiteList.updateList([]);
    blackList.updateList([]);
    chrome.runtime.sendMessage.mockClear();
    chrome.runtime.onMessage.clearListeners();
    chrome.storage.sync.set.mockClear();
    chrome.storage.onChanged.clearListeners();
    chrome.contextMenus.onClicked.clearListeners();
    chrome.contextMenus.create.mockClear();
    chrome.contextMenus.removeAll.mockClear();
  });

  //======================================

  describe("sendRuntimeMessage", () => {
    it("should call runtime.sendMessage with the given message", () => {
      expect.assertions(3);

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

      const testMessage = { type: EventMessage.BLACKLIST_UPDATED };
      sendRuntimeMessage(testMessage);

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith(testMessage);
    });
  });

  describe("updateChromeStorage", () => {
    it("should call storage.sync.set for each store in stores", () => {
      expect.assertions(5);

      expect(chrome.storage.sync.set).not.toHaveBeenCalled();

      updateChromeStorage([]);

      expect(chrome.storage.sync.set).not.toHaveBeenCalled();

      chrome.storage.sync.set.mockClear();

      updateChromeStorage(["blackList"]);

      expect(chrome.storage.sync.set).toHaveBeenCalledTimes(1);

      chrome.storage.sync.set.mockClear();

      updateChromeStorage(["blackList", "whiteList"]);

      expect(chrome.storage.sync.set).toHaveBeenCalledTimes(2);

      chrome.storage.sync.set.mockClear();

      updateChromeStorage(["genStore", "blackList", "whiteList"]);

      expect(chrome.storage.sync.set).toHaveBeenCalledTimes(3);
    });

    describe('stores contains "genStore"', () => {
      it("should call storage.sync.set with the current general store state", () => {
        expect.assertions(5);

        expect(chrome.storage.sync.set).not.toHaveBeenCalled();

        const newStore = { ...defaults.generalStore, enabled: false };
        updateChromeStorage(["genStore"]);

        expect(chrome.storage.sync.set).toHaveBeenCalledTimes(1);
        expect(chrome.storage.sync.set).toHaveBeenCalledWith({
          generalStore: generalStore.getState(),
        });

        generalStore.setState(newStore);
        updateChromeStorage(["genStore"]);

        expect(chrome.storage.sync.set).toHaveBeenCalledTimes(2);
        expect(chrome.storage.sync.set).toHaveBeenCalledWith({
          generalStore: newStore,
        });
      });
    });

    describe('stores contains "blackList', () => {
      it("should call storage.sync.set with the current blackList users", () => {
        expect.assertions(5);

        expect(chrome.storage.sync.set).not.toHaveBeenCalled();

        const newBlackList = [...defaults.userList()];
        updateChromeStorage(["blackList"]);

        expect(chrome.storage.sync.set).toHaveBeenCalledTimes(1);
        expect(chrome.storage.sync.set).toHaveBeenCalledWith({
          blackList: [],
        });

        blackList.updateList(newBlackList);
        updateChromeStorage(["blackList"]);

        expect(chrome.storage.sync.set).toHaveBeenCalledTimes(2);
        expect(chrome.storage.sync.set).toHaveBeenCalledWith({
          blackList: newBlackList,
        });
      });
    });

    describe('stores contains "whiteList"', () => {
      it("should call storage.sync.set with the current whiteList users", () => {
        expect.assertions(5);

        expect(chrome.storage.sync.set).not.toHaveBeenCalled();

        const newWhiteList = [...defaults.userList()];
        updateChromeStorage(["whiteList"]);

        expect(chrome.storage.sync.set).toHaveBeenCalledTimes(1);
        expect(chrome.storage.sync.set).toHaveBeenCalledWith({
          whiteList: [],
        });

        whiteList.updateList(newWhiteList);
        updateChromeStorage(["whiteList"]);

        expect(chrome.storage.sync.set).toHaveBeenCalledTimes(2);
        expect(chrome.storage.sync.set).toHaveBeenCalledWith({
          whiteList: newWhiteList,
        });
      });
    });
  });

  describe("updateStyles", () => {
    it("should call styles.updateStyles with genStore state, blackList users and whiteList users", () => {
      expect.assertions(3);

      const styleSpy = jest.spyOn(styles, "updateStyles");
      expect(styleSpy).not.toHaveBeenCalled();

      updateStyles();

      expect(styleSpy).toHaveBeenCalledTimes(1);
      expect(styleSpy).toHaveBeenCalledWith(
        generalStore.getState(),
        blackList.getUsers(),
        whiteList.getUsers()
      );
    });
  });

  describe("updatePorts", () => {
    it("should call updateChromeStorage if options.sync is given", () => {
      expect.assertions(3);

      const updateChromeStorageSpy = jest.spyOn(
        eventPageFunctions,
        "updateChromeStorage"
      );
      const storeName = "blackList";

      expect(updateChromeStorageSpy).not.toHaveBeenCalled();

      updatePorts({ sync: [storeName] });

      expect(updateChromeStorageSpy).toHaveBeenCalledTimes(1);
      expect(updateChromeStorageSpy).toHaveBeenCalledWith([storeName]);
    });

    it('should call updateStyles if options.stylesUpdate = "all"', () => {
      expect.assertions(2);

      const updateStylesSpy = jest.spyOn(eventPageFunctions, "updateStyles");

      expect(updateStylesSpy).not.toHaveBeenCalled();

      updatePorts({ stylesUpdate: "all" });

      expect(updateStylesSpy).toHaveBeenCalledTimes(1);
    });

    it('should call styles.updateBlackList if options.stylesUpdate = "blackList"', () => {
      expect.assertions(3);

      const updateBlackListSpy = jest.spyOn(styles, "updateBlackList");

      expect(updateBlackListSpy).not.toHaveBeenCalled();

      updatePorts({ stylesUpdate: "blackList" });

      expect(updateBlackListSpy).toHaveBeenCalledTimes(1);
      expect(updateBlackListSpy).toHaveBeenCalledWith(
        blackList.getUsers(),
        generalStore.getState()
      );
    });

    it('should call styles.updateWhiteList if options.stylesUpdate = "whiteList"', () => {
      expect.assertions(3);

      const updateWhiteListSpy = jest.spyOn(styles, "updateWhiteList");

      expect(updateWhiteListSpy).not.toHaveBeenCalled();

      updatePorts({ stylesUpdate: "whiteList" });

      expect(updateWhiteListSpy).toHaveBeenCalledTimes(1);
      expect(updateWhiteListSpy).toHaveBeenCalledWith(
        whiteList.getUsers(),
        generalStore.getState()
      );
    });
  });

  describe("syncChromeStorage", () => {
    it("should call chrome.storage.sync.get with all stores", () => {
      expect.assertions(3);

      expect(chrome.storage.sync.get).not.toHaveBeenCalled();

      syncChromeStorage();

      expect(chrome.storage.sync.get).toHaveBeenCalledTimes(1);
      expect(chrome.storage.sync.get.mock.calls[0][0]).toEqual([
        "generalStore",
        "blackList",
        "whiteList",
      ]);
    });

    it("should set the respective store states if given", () => {
      expect.assertions(9);

      const genStoreSpy = jest.spyOn(generalStore, "setState");
      genStoreSpy.mockClear();
      const blackListSpy = jest.spyOn(blackList, "updateList");
      blackListSpy.mockClear();
      const whiteListSpy = jest.spyOn(whiteList, "updateList");
      whiteListSpy.mockClear();

      const mockGenStoreState: GeneralStoreState = {
        ...defaults.generalStore,
        enabled: false,
        blocking: Blocking.WHITELIST,
      };
      const mockBlackListUsers: Users = [
        { name: "test-user-1", id: "test-id-1" },
      ];
      const mockWhiteListUsers: Users = [
        { name: "test-user-2", id: "test-id-2" },
      ];

      chrome.storage.sync.get.mockImplementationOnce((keys: string[], cb) => {
        cb({
          generalStore: mockGenStoreState,
          blackList: mockBlackListUsers,
          whiteList: mockWhiteListUsers,
        });
      });

      expect(genStoreSpy).not.toHaveBeenCalled();
      expect(blackListSpy).not.toHaveBeenCalled();
      expect(whiteListSpy).not.toHaveBeenCalled();

      syncChromeStorage();

      expect(genStoreSpy).toHaveBeenCalledTimes(1);
      expect(genStoreSpy).toHaveBeenCalledWith(mockGenStoreState);

      expect(blackListSpy).toHaveBeenCalledTimes(1);
      expect(blackListSpy).toHaveBeenCalledWith(mockBlackListUsers);

      expect(whiteListSpy).toHaveBeenCalledTimes(1);
      expect(whiteListSpy).toHaveBeenCalledWith(mockWhiteListUsers);
    });

    it("should call updatePorts for each store received", () => {
      expect.assertions(7);

      const updatePortsSpy = jest.spyOn(eventPageFunctions, "updatePorts");
      updatePortsSpy.mockClear();

      const mockGenStoreState: GeneralStoreState = {
        ...defaults.generalStore,
        enabled: false,
        blocking: Blocking.WHITELIST,
      };
      const mockBlackListUsers: Users = [
        { name: "test-user-1", id: "test-id-1" },
      ];
      const mockWhiteListUsers: Users = [
        { name: "test-user-2", id: "test-id-2" },
      ];

      chrome.storage.sync.get.mockImplementationOnce((keys: string[], cb) => {
        cb({
          generalStore: mockGenStoreState,
          blackList: mockBlackListUsers,
          whiteList: mockWhiteListUsers,
        });
      });

      syncChromeStorage();

      expect(updatePortsSpy).toHaveBeenCalledTimes(3);
      expect(updatePortsSpy).toHaveBeenCalledWith({ stylesUpdate: "all" });
      expect(updatePortsSpy).toHaveBeenCalledWith({
        stylesUpdate: "blackList",
      });
      expect(updatePortsSpy).toHaveBeenCalledWith({
        stylesUpdate: "whiteList",
      });

      updatePortsSpy.mockClear();
      chrome.storage.sync.get.mockImplementationOnce((keys: string[], cb) => {
        cb({
          generalStore: mockGenStoreState,
          blackList: mockBlackListUsers,
        });
      });

      syncChromeStorage();

      expect(updatePortsSpy).toHaveBeenCalledTimes(2);
      expect(updatePortsSpy).toHaveBeenCalledWith({ stylesUpdate: "all" });
      expect(updatePortsSpy).toHaveBeenCalledWith({
        stylesUpdate: "blackList",
      });
    });

    it("should call chrome.storage.sync.set with the respective stores if missing in storage", () => {
      expect.assertions(3);

      expect(chrome.storage.sync.set).not.toHaveBeenCalled();

      chrome.storage.sync.get.mockImplementationOnce((keys: string[], cb) => {
        cb({});
      });
      syncChromeStorage();

      expect(chrome.storage.sync.set).toHaveBeenCalledTimes(1);
      expect(chrome.storage.sync.set).toHaveBeenCalledWith({
        generalStore: generalStore.getState(),
        blackList: blackList.getUsers(),
        whiteList: whiteList.getUsers(),
      });
    });
  });

  describe("linkToContentScript", () => {
    it("should create a new PortHandler", () => {
      expect.assertions(2);

      expect(mockPortHandlerModule.PortHandler).not.toHaveBeenCalled();

      const mockTab = {
        id: 1234,
      };
      linkToContentScript(mockTab as any);

      expect(mockPortHandlerModule.PortHandler).toHaveBeenCalledTimes(1);
    });

    it("should call portHandler.initialize, with the current styleRules, current enabled state", () => {
      expect.assertions(3);

      expect(mockInitialize).not.toHaveBeenCalled();

      const mockTab = {
        id: 1234,
      };
      linkToContentScript(mockTab as any);

      expect(mockInitialize).toHaveBeenCalledTimes(1);
      expect(mockInitialize).toHaveBeenCalledWith(
        styles.getStyleRules(),
        generalStore.get("enabled")
      );
    });

    it("should call portHandlers.addPort, with the port id and the portHandler", () => {
      expect.assertions(3);

      const portHandlersSpy = jest.spyOn(portHandlers, "addPort");
      expect(portHandlersSpy).not.toHaveBeenCalled();

      const mockTab = {
        id: 1234,
      };
      linkToContentScript(mockTab as any);

      expect(portHandlersSpy).toHaveBeenCalledTimes(1);
      expect(portHandlersSpy).toHaveBeenCalledWith(mockTab.id, mockPortHandler);
    });
  });

  describe("toggleEnabled", () => {
    it("should call generalStore.set with {enabled: !enabled}", () => {
      expect.assertions(3);

      const genStoreSpy = jest.spyOn(generalStore, "set");
      const enabled = generalStore.get("enabled");
      expect(genStoreSpy).not.toHaveBeenCalled();

      toggleEnabled();

      expect(genStoreSpy).toHaveBeenCalledTimes(1);
      expect(genStoreSpy).toHaveBeenCalledWith({
        enabled: !enabled,
      });
    });

    it("should call runtime.sendMessage with GEN_STORE_UPDATED and current gen store state (toggleEnabled)", () => {
      expect.assertions(3);

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

      toggleEnabled();

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: EventMessage.GEN_STORE_UPDATED,
        payload: generalStore.getState(),
      });
    });

    it("should update the general store state in chrome storage (toggleEnabled)", () => {
      expect.assertions(3);

      expect(chrome.storage.sync.set).not.toHaveBeenCalled();

      toggleEnabled();

      expect(chrome.storage.sync.set).toHaveBeenCalledTimes(1);
      expect(chrome.storage.sync.set).toHaveBeenCalledWith({
        generalStore: generalStore.getState(),
      });
    });

    it("should call portHandlers.enablePorts if enabled: true", () => {
      expect.assertions(2);

      const enablePortsSpy = jest.spyOn(portHandlers, "enablePorts");
      generalStore.set({ enabled: false });

      expect(enablePortsSpy).not.toHaveBeenCalled();

      toggleEnabled();

      expect(enablePortsSpy).toHaveBeenCalledTimes(1);
    });

    it("should call portHandlers.disablePorts if enabled: false", () => {
      expect.assertions(2);

      const disablePortsSpy = jest.spyOn(portHandlers, "disablePorts");
      generalStore.set({ enabled: true });

      expect(disablePortsSpy).not.toHaveBeenCalled();

      toggleEnabled();

      expect(disablePortsSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("toggleHighlightBlocked", () => {
    it("should call generalStore.set with {highlightBlocked: !highlightBlocked}", () => {
      expect.assertions(3);

      const genStoreSpy = jest.spyOn(generalStore, "set");
      genStoreSpy.mockClear();
      const highlightBlocked = generalStore.get("highlightBlocked");
      expect(genStoreSpy).not.toHaveBeenCalled();

      toggleHighlightBlocked();

      expect(genStoreSpy).toHaveBeenCalledTimes(1);
      expect(genStoreSpy).toHaveBeenCalledWith({
        highlightBlocked: !highlightBlocked,
      });
    });

    it("should call runtime.sendMessage with GEN_STORE_UPDATED and current gen store state (toggleHighlightBlocked)", () => {
      expect.assertions(3);

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

      toggleHighlightBlocked();

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: EventMessage.GEN_STORE_UPDATED,
        payload: generalStore.getState(),
      });
    });

    it("should update the general store state in chrome storage (toggleHighlightBlocked)", () => {
      expect.assertions(3);

      expect(chrome.storage.sync.set).not.toHaveBeenCalled();

      toggleHighlightBlocked();

      expect(chrome.storage.sync.set).toHaveBeenCalledTimes(1);
      expect(chrome.storage.sync.set).toHaveBeenCalledWith({
        generalStore: generalStore.getState(),
      });
    });

    it("should call styles.updateStyles with genStore state, blackList users and whiteList user (toggleHighlightBlocked)", () => {
      expect.assertions(3);

      const styleSpy = jest.spyOn(styles, "updateStyles");
      styleSpy.mockClear();
      expect(styleSpy).not.toHaveBeenCalled();

      toggleHighlightBlocked();

      expect(styleSpy).toHaveBeenCalledTimes(1);
      expect(styleSpy).toHaveBeenCalledWith(
        generalStore.getState(),
        blackList.getUsers(),
        whiteList.getUsers()
      );
    });

    it("should call portHandlers.updatePorts with the current style rules (toggleHighlightBlocked)", () => {
      expect.assertions(3);

      const updatePortsSpy = jest.spyOn(portHandlers, "updatePorts");
      generalStore.set({ enabled: false });

      expect(updatePortsSpy).not.toHaveBeenCalled();

      toggleHighlightBlocked();

      expect(updatePortsSpy).toHaveBeenCalledTimes(1);
      expect(updatePortsSpy).toHaveBeenCalledWith(styles.getStyleRules());
    });
  });

  describe("toggleHighlightFavourite", () => {
    it("should call generalStore.set with {highlightFavourite: !highlightFavourite}", () => {
      expect.assertions(3);

      const genStoreSpy = jest.spyOn(generalStore, "set");
      genStoreSpy.mockClear();
      const highlightFavourite = generalStore.get("highlightFavourite");
      expect(genStoreSpy).not.toHaveBeenCalled();

      toggleHighlightFavourite();

      expect(genStoreSpy).toHaveBeenCalledTimes(1);
      expect(genStoreSpy).toHaveBeenCalledWith({
        highlightFavourite: !highlightFavourite,
      });
    });

    it("should call runtime.sendMessage with GEN_STORE_UPDATED and current gen store state (toggleHighlightFavourite)", () => {
      expect.assertions(3);

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

      toggleHighlightFavourite();

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: EventMessage.GEN_STORE_UPDATED,
        payload: generalStore.getState(),
      });
    });

    it("should update the general store state in chrome storage (toggleHighlightFavourite)", () => {
      expect.assertions(3);

      expect(chrome.storage.sync.set).not.toHaveBeenCalled();

      toggleHighlightFavourite();

      expect(chrome.storage.sync.set).toHaveBeenCalledTimes(1);
      expect(chrome.storage.sync.set).toHaveBeenCalledWith({
        generalStore: generalStore.getState(),
      });
    });

    it("should call styles.updateStyles with genStore state, blackList users and whiteList user (toggleHighlightFavourite)", () => {
      expect.assertions(3);

      const styleSpy = jest.spyOn(styles, "updateStyles");
      styleSpy.mockClear();
      expect(styleSpy).not.toHaveBeenCalled();

      toggleHighlightFavourite();

      expect(styleSpy).toHaveBeenCalledTimes(1);
      expect(styleSpy).toHaveBeenCalledWith(
        generalStore.getState(),
        blackList.getUsers(),
        whiteList.getUsers()
      );
    });

    it("should call portHandlers.updatePorts with the current style rules (toggleHighlightFavourite)", () => {
      expect.assertions(3);

      const updatePortsSpy = jest.spyOn(portHandlers, "updatePorts");
      updatePortsSpy.mockClear();
      generalStore.set({ enabled: false });

      expect(updatePortsSpy).not.toHaveBeenCalled();

      toggleHighlightBlocked();

      expect(updatePortsSpy).toHaveBeenCalledTimes(1);
      expect(updatePortsSpy).toHaveBeenCalledWith(styles.getStyleRules());
    });
  });

  describe("setBlocking", () => {
    it("should call generalStore.set with expected blocking state", () => {
      expect.assertions(7);

      const genStoreSpy = jest.spyOn(generalStore, "set");

      generalStore.set({ blocking: 0 });
      genStoreSpy.mockClear();
      expect(genStoreSpy).not.toHaveBeenCalled();

      setBlocking(Blocking.NONE);
      expect(genStoreSpy).toHaveBeenCalledTimes(1);
      expect(genStoreSpy).toHaveBeenCalledWith({
        blocking: Blocking.NONE,
      });

      genStoreSpy.mockClear();
      setBlocking(Blocking.BLACKLIST);
      expect(genStoreSpy).toHaveBeenCalledTimes(1);
      expect(genStoreSpy).toHaveBeenLastCalledWith({
        blocking: Blocking.BLACKLIST,
      });

      genStoreSpy.mockClear();
      setBlocking(Blocking.WHITELIST);
      expect(genStoreSpy).toHaveBeenCalledTimes(1);
      expect(genStoreSpy).toHaveBeenLastCalledWith({
        blocking: Blocking.WHITELIST,
      });
    });

    it("should call runtime.sendMessage with GEN_STORE_UPDATED and current gen store state ", () => {
      expect.assertions(3);

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

      setBlocking(Blocking.BLACKLIST);

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: EventMessage.GEN_STORE_UPDATED,
        payload: generalStore.getState(),
      });
    });

    it("should update the general store state in chrome storage ", () => {
      expect.assertions(3);

      expect(chrome.storage.sync.set).not.toHaveBeenCalled();

      setBlocking(Blocking.BLACKLIST);

      expect(chrome.storage.sync.set).toHaveBeenCalledTimes(1);
      expect(chrome.storage.sync.set).toHaveBeenCalledWith({
        generalStore: generalStore.getState(),
      });
    });

    it("should call styles.updateStyles with genStore state, blackList users and whiteList user (setBlocking)", () => {
      expect.assertions(3);

      const styleSpy = jest.spyOn(styles, "updateStyles");
      styleSpy.mockClear();
      expect(styleSpy).not.toHaveBeenCalled();

      setBlocking(Blocking.BLACKLIST);

      expect(styleSpy).toHaveBeenCalledTimes(1);
      expect(styleSpy).toHaveBeenCalledWith(
        generalStore.getState(),
        blackList.getUsers(),
        whiteList.getUsers()
      );
    });

    it("should call portHandlers.updatePorts with the current style rules (setBlocking)", () => {
      expect.assertions(3);

      const updatePortsSpy = jest.spyOn(portHandlers, "updatePorts");
      updatePortsSpy.mockClear();
      generalStore.set({ enabled: false });

      expect(updatePortsSpy).not.toHaveBeenCalled();

      setBlocking(Blocking.BLACKLIST);

      expect(updatePortsSpy).toHaveBeenCalledTimes(1);
      expect(updatePortsSpy).toHaveBeenCalledWith(styles.getStyleRules());
    });
  });

  describe("addToBlackList", () => {
    it("should call blackList.createUser", () => {
      expect.assertions(3);

      const createUserSpy = jest.spyOn(blackList, "createUser");
      const newUser = { name: "test-user", id: "1234-5" };
      expect(createUserSpy).not.toHaveBeenCalled();

      addToBlackList(newUser);

      expect(createUserSpy).toHaveBeenCalledTimes(1);
      expect(createUserSpy).toHaveBeenCalledWith(newUser);
    });

    it("should call updatePorts with the correct options (addToBlackList)", () => {
      expect.assertions(3);

      const updatePortsSpy = jest.spyOn(eventPageFunctions, "updatePorts");
      updatePortsSpy.mockClear();

      expect(updatePortsSpy).not.toHaveBeenCalled();

      addToBlackList({ name: "test-user", id: "1234-5" });

      expect(updatePortsSpy).toHaveBeenCalledTimes(1);
      expect(updatePortsSpy).toHaveBeenCalledWith({
        sync: ["blackList"],
        stylesUpdate: "blackList",
      });
    });

    it("should call runtime.sendMessage BLACKLIST_UPDATED with the updated blacklist users (addToBlackList)", () => {
      expect.assertions(3);

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

      addToBlackList({ name: "test-user", id: "1234-5" });

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: EventMessage.BLACKLIST_UPDATED,
        payload: blackList.getUsers(),
      });
    });
  });

  describe("removeFromBlackList", () => {
    it("should call blackList.deleteUser", () => {
      expect.assertions(3);

      const deleteUserSpy = jest.spyOn(blackList, "deleteUser");
      const newUser = { name: "test-user", id: "1234-5" };
      expect(deleteUserSpy).not.toHaveBeenCalled();

      removeFromBlackList(newUser);

      expect(deleteUserSpy).toHaveBeenCalledTimes(1);
      expect(deleteUserSpy).toHaveBeenCalledWith(newUser.id);
    });

    it("should call updatePorts with the correct options (removeFromBlackList)", () => {
      expect.assertions(3);

      const updatePortsSpy = jest.spyOn(eventPageFunctions, "updatePorts");
      updatePortsSpy.mockClear();
      const testUser = { name: "test-user", id: "1234-5" };
      blackList.createUser(testUser);

      expect(updatePortsSpy).not.toHaveBeenCalled();

      removeFromBlackList(testUser);

      expect(updatePortsSpy).toHaveBeenCalledTimes(1);
      expect(updatePortsSpy).toHaveBeenCalledWith({
        sync: ["blackList"],
        stylesUpdate: "blackList",
      });
    });

    it("should call runtime.sendMessage BLACKLIST_UPDATED with the updated blacklist users (removeFromBlackList)", () => {
      expect.assertions(3);

      const testUser = { name: "test-user", id: "1234-5" };
      blackList.createUser(testUser);

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

      removeFromBlackList(testUser);

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: EventMessage.BLACKLIST_UPDATED,
        payload: blackList.getUsers(),
      });
    });
  });

  describe("updateBlackListUser", () => {
    it("should call blackList.updateUser with a user.id and the updated fields", () => {
      expect.assertions(3);

      const updateUserSpy = jest.spyOn(blackList, "updateUser");
      const testUser = { name: "test-user", id: "1234-5" };
      const update = { name: "updated-user-name" };
      blackList.createUser(testUser);

      expect(updateUserSpy).not.toHaveBeenCalled();

      updateBlackListUser(testUser, update);

      expect(updateUserSpy).toHaveBeenCalledTimes(1);
      expect(updateUserSpy).toHaveBeenCalledWith(testUser.id, update);
    });

    it("should call updatePorts with the correct options (updateBlackListUser)", () => {
      expect.assertions(3);

      const updatePortsSpy = jest.spyOn(eventPageFunctions, "updatePorts");
      updatePortsSpy.mockClear();
      const testUser = { name: "test-user", id: "1234-5" };
      const update = { name: "updated-user-name" };
      blackList.createUser(testUser);

      expect(updatePortsSpy).not.toHaveBeenCalled();

      updateBlackListUser(testUser, update);

      expect(updatePortsSpy).toHaveBeenCalledTimes(1);
      expect(updatePortsSpy).toHaveBeenCalledWith({
        sync: ["blackList"],
        stylesUpdate: "blackList",
      });
    });

    it("should call runtime.sendMessage BLACKLIST_UPDATED with the updated blacklist users (updateBlackListUser)", () => {
      expect.assertions(3);

      const testUser = { name: "test-user", id: "1234-5" };
      const update = { name: "updated-user-name" };
      blackList.createUser(testUser);

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

      updateBlackListUser(testUser, update);

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: EventMessage.BLACKLIST_UPDATED,
        payload: blackList.getUsers(),
      });
    });
  });

  describe("switchBlackListUser", () => {
    it("should call whitelist.createUser with the given user (switchBlackListUser)", () => {
      expect.assertions(3);

      const createUserSpy = jest.spyOn(whiteList, "createUser");
      createUserSpy.mockClear();
      const testUser = { name: "test-user", id: "1234-5" };
      expect(createUserSpy).not.toHaveBeenCalled();

      switchBlackListUser(testUser);

      expect(createUserSpy).toHaveBeenCalledTimes(1);
      expect(createUserSpy).toHaveBeenCalledWith(testUser);
    });

    it("should call blackList.deleteUser with the given user, if createUser returns true", () => {
      expect.assertions(3);

      const deleteUserSpy = jest.spyOn(blackList, "deleteUser");
      deleteUserSpy.mockClear();
      const testUser = { name: "test-user", id: "1234-5" };
      expect(deleteUserSpy).not.toHaveBeenCalled();

      switchBlackListUser(testUser);

      expect(deleteUserSpy).toHaveBeenCalledTimes(1);
      expect(deleteUserSpy).toHaveBeenCalledWith(testUser.id);
    });

    it("should not call blackList.deleteUser, if createUser returns false", () => {
      expect.assertions(2);

      const deleteUserSpy = jest.spyOn(blackList, "deleteUser");
      deleteUserSpy.mockClear();
      const testUser = { name: "test-user", id: "1234-5" };
      whiteList.createUser(testUser);
      expect(deleteUserSpy).not.toHaveBeenCalled();

      switchBlackListUser(testUser);

      expect(deleteUserSpy).not.toHaveBeenCalled();
    });

    it("should call updatePorts with the expected options (switchBlackListUser)", () => {
      expect.assertions(3);

      const updatePortsSpy = jest.spyOn(eventPageFunctions, "updatePorts");
      updatePortsSpy.mockClear();
      const testUser = { name: "test-user", id: "1234-5" };

      expect(updatePortsSpy).not.toHaveBeenCalled();

      switchBlackListUser(testUser);

      expect(updatePortsSpy).toHaveBeenCalledTimes(1);
      expect(updatePortsSpy).toHaveBeenCalledWith({
        sync: ["blackList", "whiteList"],
        stylesUpdate: "all",
      });
    });

    it("should call runtime.sendMessage BLACKLIST_UPDATED with the updated blacklist users (switchBlackListUser)", () => {
      expect.assertions(3);

      const testUser = { name: "test-user", id: "1234-5" };

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

      switchBlackListUser(testUser);

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(2);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: EventMessage.BLACKLIST_UPDATED,
        payload: blackList.getUsers(),
      });
    });

    it("should call runtime.sendMessage WHITELIST_UPDATED with the updated whitelist users (switchBlackListUser)", () => {
      expect.assertions(3);

      const testUser = { name: "test-user", id: "1234-5" };

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

      switchBlackListUser(testUser);

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(2);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: EventMessage.WHITELIST_UPDATED,
        payload: whiteList.getUsers(),
      });
    });
  });

  describe("addToWhiteList", () => {
    it("should call whiteList.createUser", () => {
      expect.assertions(3);

      const createUserSpy = jest.spyOn(whiteList, "createUser");
      createUserSpy.mockClear();
      const newUser = { name: "test-user", id: "1234-5" };
      expect(createUserSpy).not.toHaveBeenCalled();

      addToWhiteList(newUser);

      expect(createUserSpy).toHaveBeenCalledTimes(1);
      expect(createUserSpy).toHaveBeenCalledWith(newUser);
    });

    it("should call updatePorts with the correct options (addToWhiteList)", () => {
      expect.assertions(3);

      const updatePortsSpy = jest.spyOn(eventPageFunctions, "updatePorts");
      updatePortsSpy.mockClear();

      expect(updatePortsSpy).not.toHaveBeenCalled();

      addToWhiteList({ name: "test-user", id: "1234-5" });

      expect(updatePortsSpy).toHaveBeenCalledTimes(1);
      expect(updatePortsSpy).toHaveBeenCalledWith({
        sync: ["whiteList"],
        stylesUpdate: "whiteList",
      });
    });

    it("should call runtime.sendMessage WHITELIST_UPDATED with the updated whitelist users (addToWhiteList)", () => {
      expect.assertions(3);

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

      addToWhiteList({ name: "test-user", id: "1234-5" });

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: EventMessage.WHITELIST_UPDATED,
        payload: whiteList.getUsers(),
      });
    });
  });

  describe("removeFromWhiteList", () => {
    it("should call whiteList.deleteUser", () => {
      expect.assertions(3);

      const deleteUserSpy = jest.spyOn(whiteList, "deleteUser");
      const newUser = { name: "test-user", id: "1234-5" };
      expect(deleteUserSpy).not.toHaveBeenCalled();

      removeFromWhiteList(newUser);

      expect(deleteUserSpy).toHaveBeenCalledTimes(1);
      expect(deleteUserSpy).toHaveBeenCalledWith(newUser.id);
    });

    it("should call updatePorts with the correct options (removeFromWhiteList)", () => {
      expect.assertions(3);

      const updatePortsSpy = jest.spyOn(eventPageFunctions, "updatePorts");
      updatePortsSpy.mockClear();
      const testUser = { name: "test-user", id: "1234-5" };
      whiteList.createUser(testUser);

      expect(updatePortsSpy).not.toHaveBeenCalled();

      removeFromWhiteList(testUser);

      expect(updatePortsSpy).toHaveBeenCalledTimes(1);
      expect(updatePortsSpy).toHaveBeenCalledWith({
        sync: ["whiteList"],
        stylesUpdate: "whiteList",
      });
    });

    it("should call runtime.sendMessage WHITELIST_UPDATED with the updated whitelist users (removeFromWhiteList)", () => {
      expect.assertions(3);

      const testUser = { name: "test-user", id: "1234-5" };
      whiteList.createUser(testUser);

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

      removeFromWhiteList(testUser);

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: EventMessage.WHITELIST_UPDATED,
        payload: whiteList.getUsers(),
      });
    });
  });

  describe("updateWhiteListUser", () => {
    it("should call whiteList.updateUser with a user.id and the updated fields", () => {
      expect.assertions(3);

      const updateUserSpy = jest.spyOn(whiteList, "updateUser");
      const testUser = { name: "test-user", id: "1234-5" };
      const update = { name: "updated-user-name" };
      whiteList.createUser(testUser);

      expect(updateUserSpy).not.toHaveBeenCalled();

      updateWhiteListUser(testUser, update);

      expect(updateUserSpy).toHaveBeenCalledTimes(1);
      expect(updateUserSpy).toHaveBeenCalledWith(testUser.id, update);
    });

    it("should call updatePorts with the correct options (updateWhiteListUser)", () => {
      expect.assertions(3);

      const updatePortsSpy = jest.spyOn(eventPageFunctions, "updatePorts");
      updatePortsSpy.mockClear();
      const testUser = { name: "test-user", id: "1234-5" };
      const update = { name: "updated-user-name" };
      whiteList.createUser(testUser);

      expect(updatePortsSpy).not.toHaveBeenCalled();

      updateWhiteListUser(testUser, update);

      expect(updatePortsSpy).toHaveBeenCalledTimes(1);
      expect(updatePortsSpy).toHaveBeenCalledWith({
        sync: ["whiteList"],
        stylesUpdate: "whiteList",
      });
    });

    it("should call runtime.sendMessage WHITELIST_UPDATED with the updated whitelist users (updateWhiteListUser)", () => {
      expect.assertions(3);

      const testUser = { name: "test-user", id: "1234-5" };
      const update = { name: "updated-user-name" };
      whiteList.createUser(testUser);

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

      updateWhiteListUser(testUser, update);

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: EventMessage.WHITELIST_UPDATED,
        payload: whiteList.getUsers(),
      });
    });
  });

  describe("switchWhiteListUser", () => {
    it("should call blacklist.createUser with the given user (switchWhiteListUser)", () => {
      expect.assertions(3);

      const createUserSpy = jest.spyOn(blackList, "createUser");
      createUserSpy.mockClear();
      const testUser = { name: "test-user", id: "1234-5" };
      expect(createUserSpy).not.toHaveBeenCalled();

      switchWhiteListUser(testUser);

      expect(createUserSpy).toHaveBeenCalledTimes(1);
      expect(createUserSpy).toHaveBeenCalledWith(testUser);
    });

    it("should call whiteList.deleteUser with the given user, if createUser returns true", () => {
      expect.assertions(3);

      const deleteUserSpy = jest.spyOn(whiteList, "deleteUser");
      deleteUserSpy.mockClear();
      const testUser = { name: "test-user", id: "1234-5" };
      expect(deleteUserSpy).not.toHaveBeenCalled();

      switchWhiteListUser(testUser);

      expect(deleteUserSpy).toHaveBeenCalledTimes(1);
      expect(deleteUserSpy).toHaveBeenCalledWith(testUser.id);
    });

    it("should not call whiteList.deleteUser, if createUser returns false", () => {
      expect.assertions(2);

      const deleteUserSpy = jest.spyOn(whiteList, "deleteUser");
      deleteUserSpy.mockClear();
      const testUser = { name: "test-user", id: "1234-5" };
      blackList.createUser(testUser);
      expect(deleteUserSpy).not.toHaveBeenCalled();

      switchWhiteListUser(testUser);

      expect(deleteUserSpy).not.toHaveBeenCalled();
    });

    it("should call updatePorts with the expected options (switchWhiteListUser)", () => {
      expect.assertions(3);

      const updatePortsSpy = jest.spyOn(eventPageFunctions, "updatePorts");
      updatePortsSpy.mockClear();
      const testUser = { name: "test-user", id: "1234-5" };

      expect(updatePortsSpy).not.toHaveBeenCalled();

      switchWhiteListUser(testUser);

      expect(updatePortsSpy).toHaveBeenCalledTimes(1);
      expect(updatePortsSpy).toHaveBeenCalledWith({
        sync: ["blackList", "whiteList"],
        stylesUpdate: "all",
      });
    });

    it("should call runtime.sendMessage BLACKLIST_UPDATED with the updated blacklist users (switchWhiteListUser)", () => {
      expect.assertions(3);

      const testUser = { name: "test-user", id: "1234-5" };

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

      switchWhiteListUser(testUser);

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(2);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: EventMessage.BLACKLIST_UPDATED,
        payload: blackList.getUsers(),
      });
    });

    it("should call runtime.sendMessage WHITELIST_UPDATED with the updated whitelist users (switchWhiteListUser)", () => {
      expect.assertions(3);

      const testUser = { name: "test-user", id: "1234-5" };

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

      switchWhiteListUser(testUser);

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(2);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: EventMessage.WHITELIST_UPDATED,
        payload: whiteList.getUsers(),
      });
    });
  });

  describe("addRuntimeListener", () => {
    it("should call runtimeListener", () => {
      expect.assertions(2);

      expect(mockRuntimeListenerModule.runtimeListener).not.toHaveBeenCalled();

      addRuntimeListener();

      expect(mockRuntimeListenerModule.runtimeListener).toHaveBeenCalledTimes(
        1
      );
    });

    it("should add the runtimeListener to runtime.onMessage", () => {
      expect.assertions(3);

      expect(chrome.runtime.onMessage.hasListeners()).toBe(false);

      addRuntimeListener();

      expect(chrome.runtime.onMessage.hasListeners()).toBe(true);
      expect(
        chrome.runtime.onMessage.hasListener(
          mockRuntimeListenerModule.runtimeListener()
        )
      ).toBe(true);
    });
  });

  describe("addStorageListener", () => {
    it("should call syncListener with the current generalStore, blackList, whiteList, styles, and, portHandlers", () => {
      expect.assertions(3);

      expect(mockSyncListenerModule.syncListener).not.toHaveBeenCalled();

      addStorageListener();

      expect(mockSyncListenerModule.syncListener).toHaveBeenCalledTimes(1);
      expect(mockSyncListenerModule.syncListener).toHaveBeenCalledWith(
        generalStore,
        blackList,
        whiteList,
        styles,
        portHandlers
      );
    });

    it("should add the syncListener to storage.onChanged", () => {
      expect.assertions(3);

      expect(chrome.storage.onChanged.hasListeners()).toBe(false);

      addStorageListener();

      expect(chrome.storage.onChanged.hasListeners()).toBe(true);
      expect(
        chrome.storage.onChanged.hasListener(
          mockSyncListenerModule.syncListener(
            generalStore,
            blackList,
            whiteList,
            styles,
            portHandlers
          )
        )
      ).toBe(true);
    });
  });

  describe("initializeEventPage", () => {
    it("should call addRuntimeListener, addStorageListener, and syncChromeStorage", () => {
      expect.assertions(6);

      const addRuntimeSpy = jest.spyOn(
        eventPageFunctions,
        "addRuntimeListener"
      );
      const addStorageSpy = jest.spyOn(
        eventPageFunctions,
        "addStorageListener"
      );

      const syncChromeStorageSpy = jest.spyOn(
        eventPageFunctions,
        "syncChromeStorage"
      );

      expect(addRuntimeSpy).not.toHaveBeenCalled();
      expect(addStorageSpy).not.toHaveBeenCalled();
      expect(syncChromeStorageSpy).not.toHaveBeenCalled();

      initializeEventPage();

      expect(addRuntimeSpy).toHaveBeenCalledTimes(1);
      expect(addStorageSpy).toHaveBeenCalledTimes(1);
      expect(syncChromeStorageSpy).toHaveBeenCalledTimes(1);
    });
  });
});
