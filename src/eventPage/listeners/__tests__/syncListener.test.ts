import { syncListener } from "..";
import {
  GeneralStore,
  UsersStore,
  PortHandlerStore,
  Styles,
} from "../../Classes";
import { defaults, MockPort } from "../../../testHelpers";
import { Blocking, EventMessage, PortMap } from "../../../types";
import { chrome } from "jest-chrome";

describe("syncListener", () => {
  // Setup

  let mockGenStore: GeneralStore;
  let mockBlackList: UsersStore;
  let mockWhiteList: UsersStore;
  let mockStyles: Styles;
  let mockPort: MockPort;
  let mockPortMap: PortMap;
  let mockPortHandlerStore: PortHandlerStore;
  let listener;

  beforeEach(() => {
    mockGenStore = new GeneralStore(defaults.generalStore);
    mockBlackList = new UsersStore("test-blackList", defaults.userList());
    mockWhiteList = new UsersStore("test-whiteList", defaults.userList());
    mockStyles = new Styles(
      mockGenStore.getState(),
      mockBlackList.getUsers(),
      mockWhiteList.getUsers()
    );
    mockPortMap = new Map();
    mockPortHandlerStore = new PortHandlerStore(mockPortMap);

    listener = syncListener(
      mockGenStore,
      mockBlackList,
      mockWhiteList,
      mockStyles,
      mockPortHandlerStore
    );
    chrome.storage.sync.set.mockClear();
    chrome.runtime.sendMessage.mockClear();
  });

  describe('"generalStore" in newValue', () => {
    it("should not sendMessage GEN_STORE_UPDATED if equal to local store", () => {
      expect.assertions(2);

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

      listener({
        newValue: {
          generalStore: defaults.generalStore,
        },
      });

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();
    });

    it("should update genStore", () => {
      expect.assertions(2);

      const newStore = {
        ...defaults.generalStore,
        blocking: Blocking.WHITELIST,
      };
      const prevGenStore = mockGenStore.getState();
      listener({
        newValue: {
          generalStore: newStore,
        },
      });

      expect(mockGenStore.getState()).not.toEqual(prevGenStore);
      expect(mockGenStore.getState()).toEqual(newStore);
    });

    it("should sendMessage GEN_STORE_UPDATED with the new store state", () => {
      expect.assertions(3);

      const newStore = {
        ...defaults.generalStore,
        blocking: Blocking.WHITELIST,
      };

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

      listener({
        newValue: {
          generalStore: newStore,
        },
      });

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: EventMessage.GEN_STORE_UPDATED,
        payload: newStore,
      });
    });

    describe("if blocking has changed", () => {
      it("should call styles.updateStyles", () => {
        expect.assertions(3);

        const newStore = {
          ...defaults.generalStore,
          blocking: Blocking.WHITELIST,
        };
        const stylesSpy = jest.spyOn(mockStyles, "updateStyles");

        expect(stylesSpy).not.toHaveBeenCalled();

        listener({
          newValue: {
            generalStore: newStore,
          },
        });

        expect(stylesSpy).toHaveBeenCalledTimes(1);
        expect(stylesSpy).toHaveBeenCalledWith(
          mockGenStore.getState(),
          mockBlackList.getUsers(),
          mockWhiteList.getUsers()
        );
      });

      it("should call portHandlerStore.updatePorts, with the new styleRules", () => {
        expect.assertions(3);

        const newStore = {
          ...defaults.generalStore,
          blocking: Blocking.WHITELIST,
        };
        const portSpy = jest.spyOn(mockPortHandlerStore, "updatePorts");

        expect(portSpy).not.toHaveBeenCalled();

        listener({
          newValue: {
            generalStore: newStore,
          },
        });

        expect(portSpy).toHaveBeenCalledTimes(1);
        expect(portSpy).toHaveBeenCalledWith(mockStyles.getStyleRules());
      });
    });

    describe("if enabled has changed", () => {
      it("should call portHandlerStore.enablePorts if enabled: true", () => {
        expect.assertions(2);

        mockGenStore.set({ enabled: false });

        const newStore = {
          ...defaults.generalStore,
          enabled: true,
        };
        const portSpy = jest.spyOn(mockPortHandlerStore, "enablePorts");

        expect(portSpy).not.toHaveBeenCalled();

        listener({
          newValue: {
            generalStore: newStore,
          },
        });

        expect(portSpy).toHaveBeenCalledTimes(1);
      });

      it("should call portHandlerStore.disablePorts if enabled: false", () => {
        expect.assertions(2);

        mockGenStore.set({ enabled: true });

        const newStore = {
          ...defaults.generalStore,
          enabled: false,
        };
        const portSpy = jest.spyOn(mockPortHandlerStore, "disablePorts");

        expect(portSpy).not.toHaveBeenCalled();

        listener({
          newValue: {
            generalStore: newStore,
          },
        });

        expect(portSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('"blackList" in newValue', () => {
    it("should not update styles/ports, or send message if equal to local blackList", () => {
      expect.assertions(6);

      const portSpy = jest.spyOn(mockPortHandlerStore, "updatePorts");
      const styleSpy = jest.spyOn(mockStyles, "updateStyles");

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();
      expect(portSpy).not.toHaveBeenCalled();
      expect(styleSpy).not.toHaveBeenCalled();

      listener({
        newValue: {
          blackList: defaults.userList(),
        },
      });

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();
      expect(portSpy).not.toHaveBeenCalled();
      expect(styleSpy).not.toHaveBeenCalled();
    });

    it("should update blackList", () => {
      expect.assertions(2);

      const newUsersList = [
        ...defaults.userList(),
        { name: "a new test user", id: "555-1" },
      ];
      const prevBlackList = mockBlackList.getUsers();

      listener({
        newValue: {
          blackList: newUsersList,
        },
      });

      expect(mockBlackList.getUsers()).not.toEqual(prevBlackList);
      expect(mockBlackList.getUsers()).toEqual(newUsersList);
    });

    it("should sendMessage BLACKLIST_UPDATED, with the new blackList", () => {
      expect.assertions(3);

      const newUsersList = [
        ...defaults.userList(),
        { name: "a new test user", id: "555-1" },
      ];

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

      listener({
        newValue: {
          blackList: newUsersList,
        },
      });

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: EventMessage.BLACKLIST_UPDATED,
        payload: newUsersList,
      });
    });

    it("should call styles.updateBlackList ", () => {
      expect.assertions(3);

      const newUsersList = [
        ...defaults.userList(),
        { name: "a new test user", id: "555-1" },
      ];
      const stylesSpy = jest.spyOn(mockStyles, "updateBlackList");

      expect(stylesSpy).not.toHaveBeenCalled();

      listener({
        newValue: {
          blackList: newUsersList,
        },
      });

      expect(stylesSpy).toHaveBeenCalledTimes(1);
      expect(stylesSpy).toHaveBeenCalledWith(
        mockBlackList.getUsers(),
        mockGenStore.getState()
      );
    });

    it("should call portHandlerStore.updatePorts, with the new styleRules ", () => {
      expect.assertions(3);

      const newUsersList = [
        ...defaults.userList(),
        { name: "a new test user", id: "555-1" },
      ];
      const portSpy = jest.spyOn(mockPortHandlerStore, "updatePorts");

      expect(portSpy).not.toHaveBeenCalled();

      listener({
        newValue: {
          blackList: newUsersList,
        },
      });

      expect(portSpy).toHaveBeenCalledTimes(1);
      expect(portSpy).toHaveBeenCalledWith(mockStyles.getStyleRules());
    });
  });

  describe('"whiteList" in newValue', () => {
    it("should not update styles/ports, or send message if equal to local whiteList", () => {
      expect.assertions(6);

      const portSpy = jest.spyOn(mockPortHandlerStore, "updatePorts");
      const styleSpy = jest.spyOn(mockStyles, "updateStyles");

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();
      expect(portSpy).not.toHaveBeenCalled();
      expect(styleSpy).not.toHaveBeenCalled();

      listener({
        newValue: {
          whiteList: defaults.userList(),
        },
      });

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();
      expect(portSpy).not.toHaveBeenCalled();
      expect(styleSpy).not.toHaveBeenCalled();
    });

    it("should update whiteList", () => {
      expect.assertions(2);

      const newUsersList = [
        ...defaults.userList(),
        { name: "a new test user", id: "555-1" },
      ];
      const prevWhiteList = mockWhiteList.getUsers();

      listener({
        newValue: {
          whiteList: newUsersList,
        },
      });

      expect(mockWhiteList.getUsers()).not.toEqual(prevWhiteList);
      expect(mockWhiteList.getUsers()).toEqual(newUsersList);
    });

    it("should sendMessage WHITELIST_UPDATED, with the new whiteList", () => {
      expect.assertions(3);

      const newUsersList = [
        ...defaults.userList(),
        { name: "a new test user", id: "555-1" },
      ];

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

      listener({
        newValue: {
          whiteList: newUsersList,
        },
      });

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: EventMessage.WHITELIST_UPDATED,
        payload: newUsersList,
      });
    });

    it("should call styles.updateWhiteList", () => {
      expect.assertions(3);

      const newUsersList = [
        ...defaults.userList(),
        { name: "a new test user", id: "555-1" },
      ];
      const stylesSpy = jest.spyOn(mockStyles, "updateWhiteList");

      expect(stylesSpy).not.toHaveBeenCalled();

      listener({
        newValue: {
          whiteList: newUsersList,
        },
      });

      expect(stylesSpy).toHaveBeenCalledTimes(1);
      expect(stylesSpy).toHaveBeenCalledWith(
        mockWhiteList.getUsers(),
        mockGenStore.getState()
      );
    });

    it("should call portHandlerStore.updatePorts, with the new styleRules  ", () => {
      expect.assertions(3);

      const newUsersList = [
        ...defaults.userList(),
        { name: "a new test user", id: "555-1" },
      ];
      const portSpy = jest.spyOn(mockPortHandlerStore, "updatePorts");

      expect(portSpy).not.toHaveBeenCalled();

      listener({
        newValue: {
          whiteList: newUsersList,
        },
      });

      expect(portSpy).toHaveBeenCalledTimes(1);
      expect(portSpy).toHaveBeenCalledWith(mockStyles.getStyleRules());
    });
  });
});
