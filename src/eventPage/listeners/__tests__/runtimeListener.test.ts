import { runtimeListener } from "..";
import {
  GeneralStore,
  UsersStore,
  PortHandlerStore,
  PortHandler,
  Styles,
} from "../../Classes";
import { defaults, MockPort } from "../../../testHelpers";
import { PortMap, EventMessage, ScriptCommand, Blocking } from "../../../types";
import { chrome } from "jest-chrome";

describe("runtimeListener", () => {
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
    listener = runtimeListener(
      mockGenStore,
      mockBlackList,
      mockWhiteList,
      mockStyles,
      mockPortHandlerStore
    );
    chrome.runtime.sendMessage.mockClear();
    chrome.storage.sync.set.mockClear();
    chrome.tabs.connect.mockImplementation((id: number) => {
      mockPort = new MockPort(id);

      return (mockPort as unknown) as chrome.runtime.Port;
    });
  });

  //====================================
  // MESSAGES

  describe("CONTENT_SCRIPT_MOUNTED", () => {
    it("should initialize a portHandler, and add it to the portHandlerStore", () => {
      expect.assertions(5);

      const mockTab = {
        id: 12345,
      };

      expect(mockPortMap.get(mockTab.id)).toBeUndefined();

      listener(
        { type: EventMessage.CONTENT_SCRIPT_MOUNTED },
        { tab: mockTab },
        () => {}
      );

      expect(mockPortMap.get(mockTab.id)).toBeInstanceOf(PortHandler);
      expect(mockPort.postMessage).toHaveBeenCalledTimes(1);
      expect(mockPort.postMessage.mock.calls[0][0]["type"]).toEqual(
        ScriptCommand.INITIALIZE
      );
      expect(mockPort.postMessage.mock.calls[0][0]["payload"]).toEqual({
        styles: mockStyles.getStyleRules(),
        enabled: mockGenStore.get("enabled"),
      });
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
    it("should update genStore", () => {
      expect.assertions(1);

      const initEnabled = mockGenStore.get("enabled");

      listener(
        {
          type: EventMessage.TOGGLE_ENABLED,
        },
        {},
        () => {}
      );

      expect(mockGenStore.get("enabled")).toEqual(!initEnabled);
    });

    it("should send GEN_STORE_UPDATED with the latest gen store state", () => {
      expect.assertions(3);

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

      listener(
        {
          type: EventMessage.TOGGLE_ENABLED,
        },
        {},
        () => {}
      );

      const newStoreState = mockGenStore.getState();

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: EventMessage.GEN_STORE_UPDATED,
        payload: newStoreState,
      });
    });

    it("should call sync.set with the latest gen store state", () => {
      expect.assertions(3);

      expect(chrome.storage.sync.set).not.toHaveBeenCalled();

      listener(
        {
          type: EventMessage.TOGGLE_ENABLED,
        },
        {},
        () => {}
      );

      const newStoreState = mockGenStore.getState();

      expect(chrome.storage.sync.set).toHaveBeenCalledTimes(1);
      expect(chrome.storage.sync.set).toHaveBeenCalledWith(newStoreState);
    });

    it("should call portHandlerStore.enablePorts if enabled: true", () => {
      expect.assertions(2);

      mockGenStore.set({ enabled: false });
      const portSpy = jest.spyOn(mockPortHandlerStore, "enablePorts");

      expect(portSpy).not.toHaveBeenCalled();

      listener(
        {
          type: EventMessage.TOGGLE_ENABLED,
        },
        {},
        () => {}
      );

      expect(portSpy).toHaveBeenCalledTimes(1);
    });

    it("should call portHandlerStore.disablePorts if enabled: false", () => {
      expect.assertions(2);

      mockGenStore.set({ enabled: true });
      const portSpy = jest.spyOn(mockPortHandlerStore, "disablePorts");

      expect(portSpy).not.toHaveBeenCalled();

      listener(
        {
          type: EventMessage.TOGGLE_ENABLED,
        },
        {},
        () => {}
      );

      expect(portSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("SWITCH_BLOCKING", () => {
    it("should update genStore ", () => {
      expect.assertions(3);

      mockGenStore.set({ blocking: 0 });
      listener(
        {
          type: EventMessage.SWITCH_BLOCKING,
        },
        {},
        () => {}
      );
      expect(mockGenStore.get("blocking")).toEqual(1);

      mockGenStore.set({ blocking: 1 });
      listener(
        {
          type: EventMessage.SWITCH_BLOCKING,
        },
        {},
        () => {}
      );
      expect(mockGenStore.get("blocking")).toEqual(2);

      mockGenStore.set({ blocking: Object.keys(Blocking).length / 2 - 1 });
      listener(
        {
          type: EventMessage.SWITCH_BLOCKING,
        },
        {},
        () => {}
      );
      expect(mockGenStore.get("blocking")).toEqual(0);
    });

    it("should send GEN_STORE_UPDATED with the latest gen store state ", () => {
      expect.assertions(3);

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

      listener(
        {
          type: EventMessage.SWITCH_BLOCKING,
        },
        {},
        () => {}
      );

      const newStoreState = mockGenStore.getState();

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: EventMessage.GEN_STORE_UPDATED,
        payload: newStoreState,
      });
    });

    it("should call sync.set with the latest gen store state ", () => {
      expect.assertions(3);

      expect(chrome.storage.sync.set).not.toHaveBeenCalled();

      listener(
        {
          type: EventMessage.SWITCH_BLOCKING,
        },
        {},
        () => {}
      );

      const newStoreState = mockGenStore.getState();

      expect(chrome.storage.sync.set).toHaveBeenCalledTimes(1);
      expect(chrome.storage.sync.set).toHaveBeenCalledWith(newStoreState);
    });

    it("should call styles.updateStyles", () => {
      expect.assertions(3);

      const stylesSpy = jest.spyOn(mockStyles, "updateStyles");

      expect(stylesSpy).not.toHaveBeenCalled();

      listener(
        {
          type: EventMessage.SWITCH_BLOCKING,
        },
        {},
        () => {}
      );

      expect(stylesSpy).toHaveBeenCalledTimes(1);
      expect(stylesSpy).toHaveBeenCalledWith(
        mockGenStore.getState(),
        mockBlackList.getUsers(),
        mockWhiteList.getUsers()
      );
    });

    it("should call portHandlerStore.updatePorts, with the new styleRules", () => {
      expect.assertions(3);

      const portSpy = jest.spyOn(mockPortHandlerStore, "updatePorts");

      expect(portSpy).not.toHaveBeenCalled();

      listener(
        {
          type: EventMessage.SWITCH_BLOCKING,
        },
        {},
        () => {}
      );

      expect(portSpy).toHaveBeenCalledTimes(1);
      expect(portSpy).toHaveBeenCalledWith(mockStyles.getStyleRules());
    });
  });
});
