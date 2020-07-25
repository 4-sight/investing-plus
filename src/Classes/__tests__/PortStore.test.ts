import { PortStore } from "../";
import { Ports } from "../../types";
import { PortHandler } from "../PortHandler";
import { MockPort } from "../../testHelpers";
import { defaultStore } from "../../constants";
import { chrome } from "jest-chrome";
import { ScriptState } from "../ScriptState";

describe("PortStore", () => {
  // Setup
  chrome.tabs.connect.mockImplementation(
    (id: number) => (new MockPort(id) as unknown) as chrome.runtime.Port
  );

  const mockPortHandler = {
    initialize: jest.fn(),
    enable: jest.fn(),
    disable: jest.fn(),
    batchUpdate: jest.fn(),
    blocking: {
      enable: jest.fn(),
      disable: jest.fn(),
    },
  };

  beforeEach(() => {
    Object.values(mockPortHandler).forEach((val) => {
      if ("mockClear" in val) {
        val.mockClear();
      } else {
        if ("enable" in val) {
          val.enable.mockClear();
        }
        if ("disable" in val) {
          val.disable.mockClear();
        }
      }
    });
  });
  //======================================

  it("should be a class", () => {
    expect.assertions(1);
    let p = new PortStore();
    expect(p).toBeInstanceOf(PortStore);
  });

  describe("Method - addPort", () => {
    it("should add a port", () => {
      expect.assertions(2);

      const mockPortMap: Ports = new Map();
      const portStore = new PortStore(mockPortMap);
      expect(mockPortMap.size).toEqual(0);

      portStore.addPort(12345, (mockPortHandler as unknown) as PortHandler);

      expect(mockPortMap.size).toEqual(1);
    });
  });

  describe("Method - removePort", () => {
    it("should return a function that removes a port", () => {
      expect.assertions(3);

      const mockPortMap: Ports = new Map();
      const portStore = new PortStore(mockPortMap);
      expect(mockPortMap.size).toEqual(0);

      portStore.addPort(12345, (mockPortHandler as unknown) as PortHandler);

      expect(mockPortMap.size).toEqual(1);

      portStore.removePort(12345)();

      expect(mockPortMap.size).toEqual(0);
    });
  });

  describe("Method - enablePorts", () => {
    it("should call portHandler.enable for each port", () => {
      expect.assertions(2);

      const mockPortMap: Ports = new Map();
      const portStore = new PortStore(mockPortMap);

      expect(mockPortHandler.enable).not.toHaveBeenCalled();

      portStore.addPort(12345, (mockPortHandler as unknown) as PortHandler);
      portStore.addPort(23456, (mockPortHandler as unknown) as PortHandler);
      portStore.addPort(34567, (mockPortHandler as unknown) as PortHandler);

      portStore.enablePorts();

      expect(mockPortHandler.enable).toHaveBeenCalledTimes(3);
    });
  });

  describe("Method - disablePorts", () => {
    it("should call portHandler.disable for each port", () => {
      expect.assertions(2);

      const mockPortMap: Ports = new Map();
      const portStore = new PortStore(mockPortMap);

      expect(mockPortHandler.enable).not.toHaveBeenCalled();

      portStore.addPort(12345, (mockPortHandler as unknown) as PortHandler);
      portStore.addPort(23456, (mockPortHandler as unknown) as PortHandler);
      portStore.addPort(34567, (mockPortHandler as unknown) as PortHandler);

      portStore.disablePorts();

      expect(mockPortHandler.disable).toHaveBeenCalledTimes(3);
    });
  });

  describe("Method - handlePortUpdate", () => {
    it("should call batchUpdate for more than one change", () => {
      expect.assertions(2);

      const mockPortMap: Ports = new Map();
      const portStore = new PortStore(mockPortMap);

      portStore.addPort(12345, (mockPortHandler as unknown) as PortHandler);
      portStore.addPort(23456, (mockPortHandler as unknown) as PortHandler);
      portStore.addPort(34567, (mockPortHandler as unknown) as PortHandler);
      const mockPort = mockPortMap.get(12345);

      expect(mockPort.batchUpdate).not.toHaveBeenCalled();

      portStore.updatePorts([new ScriptState(defaultStore), 4]);

      expect(mockPort.batchUpdate).toHaveBeenCalledTimes(3);
    });

    it("should call blocking enable if change == { blocking: true }", () => {
      expect.assertions(2);

      const mockPortMap: Ports = new Map();
      const portStore = new PortStore(mockPortMap);

      portStore.addPort(12345, (mockPortHandler as unknown) as PortHandler);
      portStore.addPort(23456, (mockPortHandler as unknown) as PortHandler);
      portStore.addPort(34567, (mockPortHandler as unknown) as PortHandler);
      const mockPort = mockPortMap.get(12345);

      expect(mockPort.blocking.enable).not.toHaveBeenCalled();

      portStore.updatePorts([{ blocking: true }, 1]);

      expect(mockPort.blocking.enable).toHaveBeenCalledTimes(3);
    });

    it("should call blocking disable if change == { blocking: false }", () => {
      expect.assertions(2);

      const mockPortMap: Ports = new Map();
      const portStore = new PortStore(mockPortMap);

      portStore.addPort(12345, (mockPortHandler as unknown) as PortHandler);
      portStore.addPort(23456, (mockPortHandler as unknown) as PortHandler);
      portStore.addPort(34567, (mockPortHandler as unknown) as PortHandler);
      const mockPort = mockPortMap.get(12345);

      expect(mockPort.blocking.disable).not.toHaveBeenCalled();

      portStore.updatePorts([{ blocking: false }, 1]);

      expect(mockPort.blocking.disable).toHaveBeenCalledTimes(3);
    });
  });
});