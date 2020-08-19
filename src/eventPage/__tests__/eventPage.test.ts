import { chrome } from "jest-chrome";
import {
  generalStore,
  blackList,
  whiteList,
  styles,
  sendRuntimeMessage,
  syncBlackList,
  syncGenStore,
  syncWhiteList,
  linkToContentScript,
  toggleEnabled,
  toggleHighlightBlocked,
  toggleHighlightFavourite,
  switchBlocking,
  addToBlackList,
  addToWhiteList,
  addRuntimeListener,
  addStorageListener,
  initializeEventPage,
  updateStyles,
  portHandlers,
} from "../eventPage";
import * as evenPageFunctions from "../eventPage";
import { EventMessage, Blocking } from "../../types";
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

  describe("syncGenStore", () => {
    it("should call storage.sync.set with the current general store state", () => {
      expect.assertions(5);

      expect(chrome.storage.sync.set).not.toHaveBeenCalled();

      const newStore = { ...defaults.generalStore, enabled: false };
      syncGenStore();

      expect(chrome.storage.sync.set).toHaveBeenCalledTimes(1);
      expect(chrome.storage.sync.set).toHaveBeenCalledWith({
        generalStore: generalStore.getState(),
      });

      generalStore.setState(newStore);
      syncGenStore();

      expect(chrome.storage.sync.set).toHaveBeenCalledTimes(2);
      expect(chrome.storage.sync.set).toHaveBeenCalledWith({
        generalStore: newStore,
      });
    });
  });

  describe("syncBlackList", () => {
    it("should call storage.sync.set with the current blackList users", () => {
      expect.assertions(5);

      expect(chrome.storage.sync.set).not.toHaveBeenCalled();

      const newBlackList = [...defaults.userList()];
      syncBlackList();

      expect(chrome.storage.sync.set).toHaveBeenCalledTimes(1);
      expect(chrome.storage.sync.set).toHaveBeenCalledWith({
        blackList: [],
      });

      blackList.updateList(newBlackList);
      syncBlackList();

      expect(chrome.storage.sync.set).toHaveBeenCalledTimes(2);
      expect(chrome.storage.sync.set).toHaveBeenCalledWith({
        blackList: newBlackList,
      });
    });
  });

  describe("syncWhiteList", () => {
    it("should call storage.sync.set with the current whiteList users", () => {
      expect.assertions(5);

      expect(chrome.storage.sync.set).not.toHaveBeenCalled();

      const newWhiteList = [...defaults.userList()];
      syncWhiteList();

      expect(chrome.storage.sync.set).toHaveBeenCalledTimes(1);
      expect(chrome.storage.sync.set).toHaveBeenCalledWith({
        whiteList: [],
      });

      whiteList.updateList(newWhiteList);
      syncWhiteList();

      expect(chrome.storage.sync.set).toHaveBeenCalledTimes(2);
      expect(chrome.storage.sync.set).toHaveBeenCalledWith({
        whiteList: newWhiteList,
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

    it("should call runtime.sendMessage with GEN_STORE_UPDATED and current gen store state", () => {
      expect.assertions(3);

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

      toggleHighlightBlocked();

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: EventMessage.GEN_STORE_UPDATED,
        payload: generalStore.getState(),
      });
    });

    it("should update the general store state in chrome storage", () => {
      expect.assertions(3);

      expect(chrome.storage.sync.set).not.toHaveBeenCalled();

      toggleHighlightBlocked();

      expect(chrome.storage.sync.set).toHaveBeenCalledTimes(1);
      expect(chrome.storage.sync.set).toHaveBeenCalledWith({
        generalStore: generalStore.getState(),
      });
    });

    it("should call styles.updateStyles with genStore state, blackList users and whiteList user ", () => {
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

    it("should call portHandlers.updatePorts with the current style rules", () => {
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

    it("should call runtime.sendMessage with GEN_STORE_UPDATED and current gen store state", () => {
      expect.assertions(3);

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

      toggleHighlightFavourite();

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: EventMessage.GEN_STORE_UPDATED,
        payload: generalStore.getState(),
      });
    });

    it("should update the general store state in chrome storage", () => {
      expect.assertions(3);

      expect(chrome.storage.sync.set).not.toHaveBeenCalled();

      toggleHighlightFavourite();

      expect(chrome.storage.sync.set).toHaveBeenCalledTimes(1);
      expect(chrome.storage.sync.set).toHaveBeenCalledWith({
        generalStore: generalStore.getState(),
      });
    });

    it("should call styles.updateStyles with genStore state, blackList users and whiteList user ", () => {
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

    it("should call portHandlers.updatePorts with the current style rules", () => {
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

  describe("switchBlocking", () => {
    it("should call generalStore.set with expected blocking state", () => {
      expect.assertions(7);

      const genStoreSpy = jest.spyOn(generalStore, "set");

      generalStore.set({ blocking: 0 });
      genStoreSpy.mockClear();
      expect(genStoreSpy).not.toHaveBeenCalled();

      switchBlocking();
      expect(genStoreSpy).toHaveBeenCalledTimes(1);
      expect(genStoreSpy).toHaveBeenCalledWith({
        blocking: 1,
      });

      generalStore.set({ blocking: 1 });
      genStoreSpy.mockClear();
      switchBlocking();
      expect(genStoreSpy).toHaveBeenCalledTimes(1);
      expect(genStoreSpy).toHaveBeenLastCalledWith({
        blocking: 2,
      });

      generalStore.set({ blocking: Object.keys(Blocking).length / 2 - 1 });
      genStoreSpy.mockClear();
      switchBlocking();
      expect(genStoreSpy).toHaveBeenCalledTimes(1);
      expect(genStoreSpy).toHaveBeenLastCalledWith({
        blocking: 0,
      });
    });

    it("should call runtime.sendMessage with GEN_STORE_UPDATED and current gen store state ", () => {
      expect.assertions(3);

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

      switchBlocking();

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: EventMessage.GEN_STORE_UPDATED,
        payload: generalStore.getState(),
      });
    });

    it("should update the general store state in chrome storage ", () => {
      expect.assertions(3);

      expect(chrome.storage.sync.set).not.toHaveBeenCalled();

      switchBlocking();

      expect(chrome.storage.sync.set).toHaveBeenCalledTimes(1);
      expect(chrome.storage.sync.set).toHaveBeenCalledWith({
        generalStore: generalStore.getState(),
      });
    });

    it("should call styles.updateStyles with genStore state, blackList users and whiteList user (switchBlocking)", () => {
      expect.assertions(3);

      const styleSpy = jest.spyOn(styles, "updateStyles");
      styleSpy.mockClear();
      expect(styleSpy).not.toHaveBeenCalled();

      switchBlocking();

      expect(styleSpy).toHaveBeenCalledTimes(1);
      expect(styleSpy).toHaveBeenCalledWith(
        generalStore.getState(),
        blackList.getUsers(),
        whiteList.getUsers()
      );
    });

    it("should call portHandlers.updatePorts with the current style rules (switchBlocking)", () => {
      expect.assertions(3);

      const updatePortsSpy = jest.spyOn(portHandlers, "updatePorts");
      updatePortsSpy.mockClear();
      generalStore.set({ enabled: false });

      expect(updatePortsSpy).not.toHaveBeenCalled();

      switchBlocking();

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

    it("should call styles.updateBlackList with blackList users, and general store state", () => {
      expect.assertions(3);

      const updateBlackListSpy = jest.spyOn(styles, "updateBlackList");
      expect(updateBlackListSpy).not.toHaveBeenCalled();

      addToBlackList({ name: "test-user", id: "1234-5" });

      expect(updateBlackListSpy).toHaveBeenCalledTimes(1);
      expect(updateBlackListSpy).toHaveBeenCalledWith(
        blackList.getUsers(),
        generalStore.getState()
      );
    });

    it("should update the blackList users in chrome storage ", () => {
      expect.assertions(3);

      expect(chrome.storage.sync.set).not.toHaveBeenCalled();

      addToBlackList({ name: "test-user", id: "1234-5" });

      expect(chrome.storage.sync.set).toHaveBeenCalledTimes(1);
      expect(chrome.storage.sync.set).toHaveBeenCalledWith({
        blackList: blackList.getUsers(),
      });
    });

    it("should call portHandlers.updatePorts with the current style rules ", () => {
      expect.assertions(3);

      const updatePortsSpy = jest.spyOn(portHandlers, "updatePorts");
      generalStore.set({ enabled: false });
      updatePortsSpy.mockClear();

      expect(updatePortsSpy).not.toHaveBeenCalled();

      addToBlackList({ name: "test-user", id: "1234-5" });

      expect(updatePortsSpy).toHaveBeenCalledTimes(1);
      expect(updatePortsSpy).toHaveBeenCalledWith(styles.getStyleRules());
    });
  });

  describe("addToWhiteList", () => {
    it("should call whiteList.createUser", () => {
      expect.assertions(3);

      const createUserSpy = jest.spyOn(whiteList, "createUser");
      const newUser = { name: "test-user", id: "1234-5" };
      expect(createUserSpy).not.toHaveBeenCalled();

      addToWhiteList(newUser);

      expect(createUserSpy).toHaveBeenCalledTimes(1);
      expect(createUserSpy).toHaveBeenCalledWith(newUser);
    });

    it("should call styles.updateWhiteList with whiteList users, and general store state", () => {
      expect.assertions(3);

      const updateWhiteListSpy = jest.spyOn(styles, "updateWhiteList");
      expect(updateWhiteListSpy).not.toHaveBeenCalled();

      addToWhiteList({ name: "test-user", id: "1234-5" });

      expect(updateWhiteListSpy).toHaveBeenCalledTimes(1);
      expect(updateWhiteListSpy).toHaveBeenCalledWith(
        whiteList.getUsers(),
        generalStore.getState()
      );
    });

    it("should update the whiteList users in chrome storage ", () => {
      expect.assertions(3);

      expect(chrome.storage.sync.set).not.toHaveBeenCalled();

      addToWhiteList({ name: "test-user", id: "1234-5" });

      expect(chrome.storage.sync.set).toHaveBeenCalledTimes(1);
      expect(chrome.storage.sync.set).toHaveBeenCalledWith({
        whiteList: whiteList.getUsers(),
      });
    });

    it("should call portHandlers.updatePorts with the current style rules  ", () => {
      expect.assertions(3);

      const updatePortsSpy = jest.spyOn(portHandlers, "updatePorts");
      generalStore.set({ enabled: false });
      updatePortsSpy.mockClear();

      expect(updatePortsSpy).not.toHaveBeenCalled();

      addToWhiteList({ name: "test-user", id: "1234-5" });

      expect(updatePortsSpy).toHaveBeenCalledTimes(1);
      expect(updatePortsSpy).toHaveBeenCalledWith(styles.getStyleRules());
    });
  });

  describe("addRuntimeListener", () => {
    it("should call runtimeListener with the current generalStore", () => {
      expect.assertions(3);

      expect(mockRuntimeListenerModule.runtimeListener).not.toHaveBeenCalled();

      addRuntimeListener();

      expect(mockRuntimeListenerModule.runtimeListener).toHaveBeenCalledTimes(
        1
      );
      expect(mockRuntimeListenerModule.runtimeListener).toHaveBeenCalledWith(
        generalStore
      );
    });

    it("should add the runtimeListener to runtime.onMessage", () => {
      expect.assertions(3);

      expect(chrome.runtime.onMessage.hasListeners()).toBe(false);

      addRuntimeListener();

      expect(chrome.runtime.onMessage.hasListeners()).toBe(true);
      expect(
        chrome.runtime.onMessage.hasListener(
          mockRuntimeListenerModule.runtimeListener(generalStore)
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
    it("should call addRuntimeListener, and addStorageListener", () => {
      expect.assertions(4);

      const addRuntimeSpy = jest.spyOn(evenPageFunctions, "addRuntimeListener");
      const addStorageSpy = jest.spyOn(evenPageFunctions, "addStorageListener");

      expect(addRuntimeSpy).not.toHaveBeenCalled();
      expect(addStorageSpy).not.toHaveBeenCalled();

      initializeEventPage();

      expect(addRuntimeSpy).toHaveBeenCalledTimes(1);
      expect(addStorageSpy).toHaveBeenCalledTimes(1);
    });
  });
});
