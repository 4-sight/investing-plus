import { PortHandlerStore } from "..";
import { PortMap } from "../../../types";
import { chrome } from "jest-chrome";
import { MockPort } from "../../../testHelpers";
import { PortHandler } from "../PortHandler";

describe("PortHandlerStore", () => {
  // Setup
  chrome.tabs.connect.mockImplementation(
    (id: number) => (new MockPort(id) as unknown) as chrome.runtime.Port
  );

  const mockPortHandler = {
    initialize: jest.fn(),
    enable: jest.fn(),
    disable: jest.fn(),
    sendStyleRules: jest.fn(),
  };

  beforeEach(() => {
    Object.values(mockPortHandler).forEach((val) => {
      if ("mockClear" in val) {
        val.mockClear();
      }
    });
  });
  //=====================================

  it("should be a class", () => {
    expect.assertions(1);

    const p = new PortHandlerStore();

    expect(p).toBeInstanceOf(PortHandlerStore);
  });

  describe("Method - addPort", () => {
    it("should add a port", () => {
      expect.assertions(2);

      const mockPortMap: PortMap = new Map();
      const portStore = new PortHandlerStore(mockPortMap);
      expect(mockPortMap.size).toEqual(0);

      portStore.addPort(12345, (mockPortHandler as unknown) as PortHandler);

      expect(mockPortMap.size).toEqual(1);
    });
  });

  describe("Method - removePort", () => {
    it("should return a function that removes a port", () => {
      expect.assertions(3);

      const mockPortMap: PortMap = new Map();
      const portStore = new PortHandlerStore(mockPortMap);
      expect(mockPortMap.size).toEqual(0);

      portStore.addPort(12345, (mockPortHandler as unknown) as PortHandler);

      expect(mockPortMap.size).toEqual(1);

      portStore.removePort(12345)();

      expect(mockPortMap.size).toEqual(0);
    });
  });

  describe("Method - enablePorts", () => {
    it("should call enable on all ports", () => {
      expect.assertions(2);

      const mockPortMap: PortMap = new Map();
      const portStore = new PortHandlerStore(mockPortMap);

      portStore.addPort(12345, (mockPortHandler as unknown) as PortHandler);
      portStore.addPort(23456, (mockPortHandler as unknown) as PortHandler);
      portStore.addPort(34567, (mockPortHandler as unknown) as PortHandler);
      const mockPort = mockPortMap.get(12345);

      expect(mockPort.enable).not.toHaveBeenCalled();

      portStore.enablePorts();

      expect(mockPort.enable).toHaveBeenCalledTimes(3);
    });
  });

  describe("Method - disablePorts", () => {
    it("should call disable on all ports", () => {
      expect.assertions(2);

      const mockPortMap: PortMap = new Map();
      const portStore = new PortHandlerStore(mockPortMap);

      portStore.addPort(12345, (mockPortHandler as unknown) as PortHandler);
      portStore.addPort(23456, (mockPortHandler as unknown) as PortHandler);
      portStore.addPort(34567, (mockPortHandler as unknown) as PortHandler);
      const mockPort = mockPortMap.get(12345);

      expect(mockPort.disable).not.toHaveBeenCalled();

      portStore.disablePorts();

      expect(mockPort.disable).toHaveBeenCalledTimes(3);
    });
  });

  describe("Method - updatePorts", () => {
    it("should call sendStyleRules on all ports, with the given string", () => {
      expect.assertions(3);

      const styleRule = "test-string";
      const mockPortMap: PortMap = new Map();
      const portStore = new PortHandlerStore(mockPortMap);

      portStore.addPort(12345, (mockPortHandler as unknown) as PortHandler);
      portStore.addPort(23456, (mockPortHandler as unknown) as PortHandler);
      portStore.addPort(34567, (mockPortHandler as unknown) as PortHandler);
      const mockPort = mockPortMap.get(12345);

      expect(mockPort.sendStyleRules).not.toHaveBeenCalled();

      portStore.updatePorts(styleRule);

      expect(mockPort.sendStyleRules).toHaveBeenCalledTimes(3);
      expect(mockPort.sendStyleRules).toHaveBeenCalledWith(styleRule);
    });
  });
});
