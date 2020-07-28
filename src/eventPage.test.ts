import { EventHandler } from "./eventPage";
import { chrome } from "jest-chrome";
import { defaults, MockPortHandler, MockPortStore } from "./testHelpers";
import { EventMessage } from "./types";
import { PortHandler, PortStore } from "./Classes";

jest.mock("./Classes/PortHandler", () => ({
  PortHandler: jest.fn(() => MockPortHandler),
}));

const mockPortHandler = (PortHandler as unknown) as jest.Mock;

describe("EventHandler", () => {
  beforeEach(() => {
    chrome.runtime.onMessage.clearListeners();
    MockPortHandler.initialize.mockClear();
    MockPortStore.addPort.mockClear();
    mockPortHandler.mockClear();
  });

  it("should be a Class", () => {
    expect.assertions(1);
    let h = new EventHandler(defaults.store);
    expect(h).toBeInstanceOf(EventHandler);
  });

  it("should add an onMessage listener", () => {
    expect.assertions(2);
    expect(chrome.runtime.onMessage.hasListeners()).toBe(false);
    new EventHandler(defaults.store);
    expect(chrome.runtime.onMessage.hasListeners()).toBe(true);
  });

  describe("EventMessage: CONTENT_SCRIPT_MOUNTED", () => {
    beforeEach(() => {
      chrome.tabs.query.mockClear();
    });

    it("should get the current active tab from chrome", () => {
      expect.assertions(3);
      new EventHandler(defaults.store);
      expect(chrome.tabs.query).not.toHaveBeenCalled();
      chrome.runtime.onMessage.callListeners(
        {
          type: EventMessage.CONTENT_SCRIPT_MOUNTED,
        },
        {},
        () => {}
      );
      expect(chrome.tabs.query).toHaveBeenCalledTimes(1);
      expect(chrome.tabs.query.mock.calls[0][0]).toEqual({
        currentWindow: true,
        active: true,
      });
    });

    it("should create a new PortHandler with the current tab", () => {
      expect.assertions(3);
      expect(mockPortHandler).not.toHaveBeenCalled();
      new EventHandler(defaults.store);
      const mockTab = ({ id: 12345 } as unknown) as chrome.tabs.Tab;
      chrome.runtime.onMessage.callListeners(
        {
          type: EventMessage.CONTENT_SCRIPT_MOUNTED,
        },
        {},
        () => {}
      );
      const callback = chrome.tabs.query.mock.calls[0][1];
      callback([mockTab]);
      expect(mockPortHandler).toHaveBeenCalledTimes(1);
      expect(mockPortHandler.mock.calls[0][0]).toEqual(mockTab);
    });

    it("should call initialize on the new port handler, with the current store", () => {
      expect.assertions(3);
      expect(MockPortHandler.initialize).not.toHaveBeenCalled();
      new EventHandler(defaults.store);
      const mockTab = ({ id: 12345 } as unknown) as chrome.tabs.Tab;
      chrome.runtime.onMessage.callListeners(
        {
          type: EventMessage.CONTENT_SCRIPT_MOUNTED,
        },
        {},
        () => {}
      );
      const callback = chrome.tabs.query.mock.calls[0][1];
      callback([mockTab]);
      expect(MockPortHandler.initialize).toHaveBeenCalledTimes(1);
      expect(MockPortHandler.initialize).toHaveBeenCalledWith(defaults.store);
    });

    it("should add the new port handler to the port store", () => {
      expect.assertions(3);
      expect(MockPortStore.addPort).not.toHaveBeenCalled();
      new EventHandler(defaults.store, (MockPortStore as unknown) as PortStore);
      const mockTab = ({ id: 12345 } as unknown) as chrome.tabs.Tab;
      chrome.runtime.onMessage.callListeners(
        {
          type: EventMessage.CONTENT_SCRIPT_MOUNTED,
        },
        {},
        () => {}
      );
      const callback = chrome.tabs.query.mock.calls[0][1];
      callback([mockTab]);
      expect(MockPortStore.addPort).toHaveBeenCalledTimes(1);
      expect(MockPortStore.addPort).toHaveBeenCalledWith(
        mockTab.id,
        MockPortHandler
      );
    });
  });

  describe("EventMessage: STORE_UPDATED", () => {
    it("should get state changes from store, sanitize and pass them to portStore.updatePorts", () => {
      expect.assertions(3);
      expect(MockPortStore.updatePorts).not.toHaveBeenCalled();

      const storeUpdate = { enabled: true, blocking: false };
      new EventHandler(defaults.store, (MockPortStore as unknown) as PortStore);
      chrome.runtime.onMessage.callListeners(
        {
          type: EventMessage.STORE_SET,
          payload: storeUpdate,
        },
        {},
        () => {}
      );

      chrome.runtime.onMessage.callListeners(
        {
          type: EventMessage.STORE_UPDATED,
          payload: storeUpdate,
        },
        {},
        () => {}
      );

      expect(MockPortStore.updatePorts).toHaveBeenCalledTimes(1);
      expect(MockPortStore.updatePorts).toHaveBeenCalledWith([
        { blocking: false },
        1,
      ]);
    });
  });
});
