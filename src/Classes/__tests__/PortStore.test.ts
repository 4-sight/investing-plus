import { PortStore } from "../";
import { Ports, Blocking } from "../../types";
import { PortHandler } from "../PortHandler";
import { MockPort } from "../../testHelpers";
import { defaults } from "../../testHelpers";
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
    setBlocking: jest.fn(),
  };

  beforeEach(() => {
    Object.values(mockPortHandler).forEach((val) => {
      if ("mockClear" in val) {
        val.mockClear();
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

      portStore.updatePorts([new ScriptState(defaults.store), 4]);

      expect(mockPort.batchUpdate).toHaveBeenCalledTimes(3);
    });

    it("should call enable if change == { enabled: true }", () => {
      expect.assertions(2);

      const mockPortMap: Ports = new Map();
      const portStore = new PortStore(mockPortMap);

      portStore.addPort(12345, (mockPortHandler as unknown) as PortHandler);
      portStore.addPort(23456, (mockPortHandler as unknown) as PortHandler);
      portStore.addPort(34567, (mockPortHandler as unknown) as PortHandler);
      const mockPort = mockPortMap.get(12345);

      expect(mockPort.enable).not.toHaveBeenCalled();

      portStore.updatePorts([{ enabled: true }, 1]);

      expect(mockPort.enable).toHaveBeenCalledTimes(3);
    });

    it("should call disable if change == { enabled: false }", () => {
      expect.assertions(2);

      const mockPortMap: Ports = new Map();
      const portStore = new PortStore(mockPortMap);

      portStore.addPort(12345, (mockPortHandler as unknown) as PortHandler);
      portStore.addPort(23456, (mockPortHandler as unknown) as PortHandler);
      portStore.addPort(34567, (mockPortHandler as unknown) as PortHandler);
      const mockPort = mockPortMap.get(12345);

      expect(mockPort.disable).not.toHaveBeenCalled();

      portStore.updatePorts([{ enabled: false }, 1]);

      expect(mockPort.disable).toHaveBeenCalledTimes(3);
    });

    it("should call setBlocking with a blocking mode if blocking has changed", () => {
      expect.assertions(3);

      const mockPortMap: Ports = new Map();
      const portStore = new PortStore(mockPortMap);

      portStore.addPort(12345, (mockPortHandler as unknown) as PortHandler);
      portStore.addPort(23456, (mockPortHandler as unknown) as PortHandler);
      portStore.addPort(34567, (mockPortHandler as unknown) as PortHandler);
      const mockPort = mockPortMap.get(12345);

      expect(mockPort.setBlocking).not.toHaveBeenCalled();

      portStore.updatePorts([{ blocking: Blocking.WHITELIST }, 1]);

      expect(mockPort.setBlocking).toHaveBeenCalledTimes(3);
      expect(mockPort.setBlocking).toHaveBeenCalledWith(Blocking.WHITELIST);
    });
  });
});
