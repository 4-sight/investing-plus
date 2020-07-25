import { PortHandler } from "..";
import { chrome } from "jest-chrome";
import { defaultStore } from "../../constants";
import { ScriptCommand, Message, ScriptStateChanges } from "../../types";
import { ScriptState } from "../ScriptState";
import { MockPort } from "../../testHelpers";

describe("Port", () => {
  // Setup
  const defaultTab = ({
    id: 2345,
  } as unknown) as chrome.tabs.Tab;

  let mockPort: MockPort;

  beforeEach(() => {
    chrome.tabs.connect.mockClear();
    mockPort = new MockPort(2345);
    chrome.tabs.connect.mockReturnValue(
      (mockPort as unknown) as chrome.runtime.Port
    );
  });

  //=========================

  it("should be a Class", () => {
    expect.assertions(1);
    let p = new PortHandler(defaultTab, () => {});
    expect(p).toBeInstanceOf(PortHandler);
  });

  it("should connect to the given tab", () => {
    expect.assertions(3);
    expect(chrome.tabs.connect).not.toHaveBeenCalled();
    new PortHandler(defaultTab, () => {});
    expect(chrome.tabs.connect).toHaveBeenCalledTimes(1);
    expect(chrome.tabs.connect).toHaveBeenCalledWith(defaultTab.id);
  });

  it("should add an onDisconnect listener to the returned port", () => {
    expect.assertions(2);
    expect(mockPort.onDisconnect.hasListeners()).toBe(false);
    new PortHandler(defaultTab, () => {});
    expect(mockPort.onDisconnect.hasListeners()).toBe(true);
  });

  it("should add an onMessage listener to the returned port", () => {
    expect.assertions(2);
    expect(mockPort.onMessage.hasListeners()).toBe(false);
    new PortHandler(defaultTab, () => {});
    expect(mockPort.onMessage.hasListeners()).toBe(true);
  });

  it("should remove onMessage listener on disconnect", () => {
    expect.assertions(3);
    expect(mockPort.onMessage.hasListeners()).toBe(false);
    new PortHandler(defaultTab, () => {});
    expect(mockPort.onMessage.hasListeners()).toBe(true);
    mockPort.onDisconnect.callListeners();
    expect(mockPort.onMessage.hasListeners()).toBe(false);
  });

  it("should call removePort on disconnect", () => {
    expect.assertions(2);
    const removePort = jest.fn();
    new PortHandler(defaultTab, removePort);
    expect(removePort).not.toHaveBeenCalled();
    mockPort.onDisconnect.callListeners();
    expect(removePort).toHaveBeenCalledTimes(1);
  });

  describe("Port.initialize", () => {
    it("should call postMessage with INITIALIZE and a ScriptState", () => {
      expect.assertions(4);
      const port = new PortHandler(defaultTab, () => {});
      expect(mockPort.postMessage).not.toHaveBeenCalled();
      port.initialize(defaultStore);
      expect(mockPort.postMessage).toHaveBeenCalledTimes(1);
      const message = mockPort.postMessage.mock.calls[0][0] as Message;
      expect(message.type).toEqual(ScriptCommand.INITIALIZE);
      expect(message.payload).toBeInstanceOf(ScriptState);
    });
  });

  describe("Port.enable", () => {
    it("should call postMessage with ENABLE", () => {
      expect.assertions(4);
      const port = new PortHandler(defaultTab, () => {});
      expect(mockPort.postMessage).not.toHaveBeenCalled();
      port.enable();
      expect(mockPort.postMessage).toHaveBeenCalledTimes(1);
      const message = mockPort.postMessage.mock.calls[0][0] as Message;
      expect(message.type).toEqual(ScriptCommand.ENABLE);
      expect(message.payload).toBeUndefined();
    });
  });

  describe("Port.disable", () => {
    it("should call postMessage with DISABLE", () => {
      expect.assertions(4);
      const port = new PortHandler(defaultTab, () => {});
      expect(mockPort.postMessage).not.toHaveBeenCalled();
      port.disable();
      expect(mockPort.postMessage).toHaveBeenCalledTimes(1);
      const message = mockPort.postMessage.mock.calls[0][0] as Message;
      expect(message.type).toEqual(ScriptCommand.DISABLE);
      expect(message.payload).toBeUndefined();
    });
  });

  describe("Port.batchUpdate", () => {
    it("should call postMessage with UPDATE_BATCH and a ScriptUpdate", () => {
      expect.assertions(4);
      const updates: ScriptStateChanges = { blocking: false };
      const port = new PortHandler(defaultTab, () => {});
      expect(mockPort.postMessage).not.toHaveBeenCalled();
      port.batchUpdate(updates);
      expect(mockPort.postMessage).toHaveBeenCalledTimes(1);
      const message = mockPort.postMessage.mock.calls[0][0] as Message;
      expect(message.type).toEqual(ScriptCommand.UPDATE_BATCH);
      expect(message.payload).toEqual(updates);
    });
  });

  describe("Port.blocking.enable", () => {
    it("should call postMessage with BLOCKING_ENABLE", () => {
      expect.assertions(4);
      const port = new PortHandler(defaultTab, () => {});
      expect(mockPort.postMessage).not.toHaveBeenCalled();
      port.blocking.enable();
      expect(mockPort.postMessage).toHaveBeenCalledTimes(1);
      const message = mockPort.postMessage.mock.calls[0][0] as Message;
      expect(message.type).toEqual(ScriptCommand.BLOCKING_ENABLE);
      expect(message.payload).toBeUndefined();
    });
  });

  describe("Port.blocking.disable", () => {
    it("should call postMessage with BLOCKING_DISABLE", () => {
      expect.assertions(4);
      const port = new PortHandler(defaultTab, () => {});
      expect(mockPort.postMessage).not.toHaveBeenCalled();
      port.blocking.disable();
      expect(mockPort.postMessage).toHaveBeenCalledTimes(1);
      const message = mockPort.postMessage.mock.calls[0][0] as Message;
      expect(message.type).toEqual(ScriptCommand.BLOCKING_DISABLE);
      expect(message.payload).toBeUndefined();
    });
  });
});
