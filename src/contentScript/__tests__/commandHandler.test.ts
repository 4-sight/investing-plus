import commandHandler, { portListener } from "../commandHandler";
import { chrome } from "jest-chrome";
import { EventMessage, ScriptCommand } from "../../types";
import { MockPort } from "../../testHelpers";
import { Runtime } from "jest-chrome/types/jest-chrome";
import { Context, ScriptState } from "../../Classes";
import { defaults } from "../../testHelpers";

describe("commandHandler", () => {
  // Setup
  const mockContext = {} as Context;

  beforeEach(() => {
    chrome.runtime.sendMessage.mockClear();
    chrome.runtime.onConnect.clearListeners();
  });
  //==========================================

  it("should call send message with CONTENT_SCRIPT_MOUNTED", () => {
    expect.assertions(3);

    expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();
    commandHandler(mockContext);
    expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
    expect(chrome.runtime.sendMessage.mock.calls[0][0]).toEqual({
      type: EventMessage.CONTENT_SCRIPT_MOUNTED,
    });
  });

  it("should add a listener to onConnect", () => {
    expect.assertions(2);

    expect(chrome.runtime.onConnect.hasListeners()).toBe(false);
    commandHandler(mockContext);
    expect(chrome.runtime.onConnect.hasListeners()).toBe(true);
  });

  it("should add an onMessage listener to the given port", () => {
    expect.assertions(2);
    const mockPort = new MockPort(2345);
    expect(mockPort.onMessage.hasListeners()).toBe(false);

    commandHandler(mockContext);
    chrome.runtime.onConnect.callListeners(
      (mockPort as unknown) as Runtime.Port
    );

    expect(mockPort.onMessage.hasListeners()).toBe(true);
  });
});

//==============================================================

describe("portListener", () => {
  // Setup
  const mockContext = {
    initializeStyles: jest.fn(),
    enable: jest.fn(),
    disable: jest.fn(),
    batchUpdateStyles: jest.fn(),
    blocking: {
      enable: jest.fn(),
      disable: jest.fn(),
    },
  };

  const listener = portListener((mockContext as unknown) as Context);

  beforeEach(() => {
    Object.values(mockContext).forEach((v) => {
      if ("mockClear" in v) {
        v.mockClear();
      }
    });

    mockContext.blocking.enable.mockClear();
    mockContext.blocking.disable.mockClear();
  });
  //==========================================

  it("should call context.initializeStyles on command - INITIALIZE", () => {
    expect.assertions(3);

    const mockState = new ScriptState(defaults.store);

    expect(mockContext.initializeStyles).not.toHaveBeenCalled();

    listener({ type: ScriptCommand.INITIALIZE, payload: mockState });

    expect(mockContext.initializeStyles).toHaveBeenCalledTimes(1);
    expect(mockContext.initializeStyles).toHaveBeenCalledWith(mockState);
  });

  it("should call context.enable on command - ENABLE", () => {
    expect.assertions(2);

    expect(mockContext.enable).not.toHaveBeenCalled();

    listener({ type: ScriptCommand.ENABLE });

    expect(mockContext.enable).toHaveBeenCalledTimes(1);
  });

  it("should call context.disable on command - DISABLE", () => {
    expect.assertions(2);

    expect(mockContext.disable).not.toHaveBeenCalled();

    listener({ type: ScriptCommand.DISABLE });

    expect(mockContext.disable).toHaveBeenCalledTimes(1);
  });

  it("should call context.batchUpdateStyles on command - UPDATE_BATCH", () => {
    expect.assertions(3);

    const mockState = new ScriptState(defaults.store);

    expect(mockContext.batchUpdateStyles).not.toHaveBeenCalled();

    listener({ type: ScriptCommand.UPDATE_BATCH, payload: mockState });

    expect(mockContext.batchUpdateStyles).toHaveBeenCalledTimes(1);
    expect(mockContext.batchUpdateStyles).toHaveBeenCalledWith(mockState);
  });

  it("should call context.blocking.enable on command - BLOCKING_ENABLE", () => {
    expect.assertions(2);

    expect(mockContext.blocking.enable).not.toHaveBeenCalled();

    listener({ type: ScriptCommand.BLOCKING_ENABLE });

    expect(mockContext.blocking.enable).toHaveBeenCalledTimes(1);
  });

  it("should call context.blocking.disable on command - BLOCKING_DISABLE", () => {
    expect.assertions(2);

    expect(mockContext.blocking.disable).not.toHaveBeenCalled();

    listener({ type: ScriptCommand.BLOCKING_DISABLE });

    expect(mockContext.blocking.disable).toHaveBeenCalledTimes(1);
  });
});
