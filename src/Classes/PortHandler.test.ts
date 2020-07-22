import { PortHandler } from ".";
import { chrome } from "jest-chrome";
import { defaults } from "../testHelpers";
import {
  ScriptCommand,
  Message,
  ScriptUpdate,
  ScriptBatchUpdate,
} from "../types";
import { ScriptState } from "./ScriptState";

class MockPort {
  name: string;
  onDisconnect: {
    addListener: (listener: Function) => void;
    clearListeners: () => void;
    removeListener: (listener: Function) => void;
    hasListeners: () => void;
    callListeners: () => void;
  };
  onMessage: {
    addListener: (listener: Function) => void;
    clearListeners: () => void;
    removeListener: (listener: Function) => void;
    hasListeners: () => void;
    callListeners: () => void;
  };
  private onDisconnectListeners: Function[];
  private onMessageListeners: Function[];

  constructor(id: number) {
    this.name = id.toString();
    this.onDisconnectListeners = [];
    this.onMessageListeners = [];
    this.onDisconnect = {
      addListener: this.addDisconnectListener,
      removeListener: this.removeDisconnectListener,
      clearListeners: this.clearDisconnectListeners,
      hasListeners: this.hasDisconnectListeners,
      callListeners: this.callDisconnectListeners,
    };

    this.onMessage = {
      addListener: this.addMessageListener,
      removeListener: this.removeMessageListener,
      clearListeners: this.clearMessageListeners,
      hasListeners: this.hasMessageListeners,
      callListeners: this.callMessageListeners,
    };
  }

  private addDisconnectListener = (listener: Function) => {
    this.onDisconnectListeners.push(listener);
  };
  private addMessageListener = (listener: Function) => {
    this.onMessageListeners.push(listener);
  };

  private removeDisconnectListener = (listener: Function) => {
    this.onDisconnectListeners = this.onDisconnectListeners.filter(
      (l) => l !== listener
    );
  };
  private removeMessageListener = (listener: Function) => {
    this.onMessageListeners = this.onMessageListeners.filter(
      (l) => l !== listener
    );
  };

  private clearDisconnectListeners = () => {
    this.onDisconnectListeners = [];
  };
  private clearMessageListeners = () => {
    this.onMessageListeners = [];
  };

  private hasDisconnectListeners = (): boolean => {
    return this.onDisconnectListeners.length > 0;
  };
  private hasMessageListeners = (): boolean => {
    return this.onMessageListeners.length > 0;
  };

  private callDisconnectListeners = () => {
    this.onDisconnectListeners.forEach((l) => l());
  };

  private callMessageListeners = () => {
    this.onMessageListeners.forEach((l) => l());
  };

  postMessage = jest.fn((message: Object) => {
    this.onMessageListeners.forEach((l) => l(message));
  });

  disconnect = () => {
    this.onDisconnectListeners.forEach((c) => c());
  };
}

//=====================================================================
//=====================================================================

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
    let p = new PortHandler(defaultTab, () => {});
    expect(p).toBeInstanceOf(PortHandler);
  });

  it("should connect to the given tab", () => {
    expect(chrome.tabs.connect).not.toHaveBeenCalled();
    new PortHandler(defaultTab, () => {});
    expect(chrome.tabs.connect).toHaveBeenCalledTimes(1);
    expect(chrome.tabs.connect).toHaveBeenCalledWith(defaultTab.id);
  });

  it("should add an onDisconnect listener to the returned port", () => {
    expect(mockPort.onDisconnect.hasListeners()).toBe(false);
    new PortHandler(defaultTab, () => {});
    expect(mockPort.onDisconnect.hasListeners()).toBe(true);
  });

  it("should add an onMessage listener to the returned port", () => {
    expect(mockPort.onMessage.hasListeners()).toBe(false);
    new PortHandler(defaultTab, () => {});
    expect(mockPort.onMessage.hasListeners()).toBe(true);
  });

  it("should remove onMessage listener on disconnect", () => {
    expect(mockPort.onMessage.hasListeners()).toBe(false);
    new PortHandler(defaultTab, () => {});
    expect(mockPort.onMessage.hasListeners()).toBe(true);
    mockPort.onDisconnect.callListeners();
    expect(mockPort.onMessage.hasListeners()).toBe(false);
  });

  it("should call removePort on disconnect", () => {
    const removePort = jest.fn();
    new PortHandler(defaultTab, removePort);
    expect(removePort).not.toHaveBeenCalled();
    mockPort.onDisconnect.callListeners();
    expect(removePort).toHaveBeenCalledTimes(1);
  });

  describe("Port.initialize", () => {
    it("should call postMessage with INITIALIZE and a ScriptState", () => {
      const port = new PortHandler(defaultTab, () => {});
      expect(mockPort.postMessage).not.toHaveBeenCalled();
      port.initialize(defaults.store);
      expect(mockPort.postMessage).toHaveBeenCalledTimes(1);
      const message = mockPort.postMessage.mock.calls[0][0] as Message;
      expect(message.type).toEqual(ScriptCommand.INITIALIZE);
      expect(message.payload).toBeInstanceOf(ScriptState);
    });
  });

  describe("Port.enable", () => {
    it("should call postMessage with ENABLE", () => {
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
      const port = new PortHandler(defaultTab, () => {});
      expect(mockPort.postMessage).not.toHaveBeenCalled();
      port.disable();
      expect(mockPort.postMessage).toHaveBeenCalledTimes(1);
      const message = mockPort.postMessage.mock.calls[0][0] as Message;
      expect(message.type).toEqual(ScriptCommand.DISABLE);
      expect(message.payload).toBeUndefined();
    });
  });

  describe("Port.update", () => {
    it("should call postMessage with UPDATE and a ScriptUpdate", () => {
      const update: ScriptUpdate = ["blocking", false];
      const port = new PortHandler(defaultTab, () => {});
      expect(mockPort.postMessage).not.toHaveBeenCalled();
      port.update(update);
      expect(mockPort.postMessage).toHaveBeenCalledTimes(1);
      const message = mockPort.postMessage.mock.calls[0][0] as Message;
      expect(message.type).toEqual(ScriptCommand.UPDATE);
      expect(message.payload).toEqual(update);
    });
  });

  describe("Port.batchUpdate", () => {
    it("should call postMessage with UPDATE_BATCH and a ScriptUpdate", () => {
      const updates: ScriptBatchUpdate = { blocking: false };
      const port = new PortHandler(defaultTab, () => {});
      expect(mockPort.postMessage).not.toHaveBeenCalled();
      port.batchUpdate(updates);
      expect(mockPort.postMessage).toHaveBeenCalledTimes(1);
      const message = mockPort.postMessage.mock.calls[0][0] as Message;
      expect(message.type).toEqual(ScriptCommand.UPDATE_BATCH);
      expect(message.payload).toEqual(updates);
    });
  });
});
