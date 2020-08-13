import { PortHandler } from "..";
import { chrome } from "jest-chrome";
import { MockPort } from "../../../testHelpers";
import { Message, ScriptCommand } from "../../../types";

describe("PortHandler", () => {
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

  //=======================================

  it("should be a class", () => {
    expect.assertions(1);

    const p = new PortHandler(defaultTab, () => {});

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

  it("should call removePort on disconnect", () => {
    expect.assertions(2);
    const removePort = jest.fn();
    new PortHandler(defaultTab, removePort);
    expect(removePort).not.toHaveBeenCalled();
    mockPort.onDisconnect.callListeners();
    expect(removePort).toHaveBeenCalledTimes(1);
  });

  describe("Port.initialize", () => {
    it("should call postMessage with INITIALIZE, and the expected payload", () => {
      expect.assertions(4);
      const port = new PortHandler(defaultTab, () => {});
      expect(mockPort.postMessage).not.toHaveBeenCalled();
      port.initialize("test-styles", true);
      expect(mockPort.postMessage).toHaveBeenCalledTimes(1);
      const message = mockPort.postMessage.mock.calls[0][0] as Message;
      expect(message.type).toEqual(ScriptCommand.INITIALIZE);
      expect(message.payload).toEqual({ styles: "test-styles", enabled: true });
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
});
