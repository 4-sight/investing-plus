import contentScript from "../contentScript";
import { MockPort } from "../../testHelpers";
import { chrome } from "jest-chrome";
import { portListener } from "../listeners";
import { EventMessage } from "../../types";

jest.mock("../listeners/portListener");

const mockPortListener = (portListener as unknown) as jest.Mock;

describe("contentScript", () => {
  // Setup
  let mockPort;
  const mockStyle = "style-element";
  const document = {
    createElement: jest.fn(() => mockStyle),
    getElementsByClassName: jest.fn(() => []),
  };
  const mockListener = "mock-listener";

  beforeEach(() => {
    mockPortListener.mockClear();
    mockPortListener.mockImplementation(() => mockListener);
    document.createElement.mockClear();
    global.document = document as any;
    mockPort = new MockPort(1234);
    chrome.runtime.sendMessage.mockClear();
    chrome.runtime.onConnect.addListener = jest.fn((cb) => {
      cb(mockPort);
    });
  });

  //==========================================

  it("should create a style element", () => {
    expect.assertions(3);
    expect(document.createElement).not.toHaveBeenCalled();

    contentScript();

    expect(document.createElement).toHaveBeenCalledTimes(1);
    expect(document.createElement).toHaveBeenCalledWith("style");
  });

  it("should add an onConnect listener", () => {
    expect.assertions(2);
    expect(chrome.runtime.onConnect.addListener).not.toHaveBeenCalled();

    contentScript();

    expect(chrome.runtime.onConnect.addListener).toHaveBeenCalledTimes(1);
  });

  it("should send a CONTENT_SCRIPT_MOUNTED message", () => {
    expect.assertions(3);

    expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();
    contentScript();
    expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
      type: EventMessage.CONTENT_SCRIPT_MOUNTED,
    });
  });

  it("should pass the style element to the port listener", () => {
    expect.assertions(3);

    expect(mockPortListener).not.toHaveBeenCalled();
    contentScript();
    expect(mockPortListener).toHaveBeenCalledTimes(1);
    expect(mockPortListener).toHaveBeenCalledWith(mockStyle);
  });

  it("should add a port listener to the port sent from event page", () => {
    expect.assertions(3);
    const portSpy = jest.spyOn(mockPort.onMessage, "addListener");

    expect(portSpy).not.toHaveBeenCalled();
    contentScript();

    expect(portSpy).toHaveBeenCalledTimes(1);
    expect(portSpy).toHaveBeenCalledWith(mockListener);
  });
});
