import { portListener, addMutationListener, removeMutationListeners } from "..";
import { ScriptCommand } from "../../../types";
import { addButtons, removeButtons } from "../../utils";

jest.mock("../../utils/handleButtons", () => ({
  addButtons: jest.fn(),
  removeButtons: jest.fn(),
}));

jest.mock("../mutationListener", () => ({
  addMutationListener: jest.fn(),
  removeMutationListeners: jest.fn(),
}));

const mockAddButtons = (addButtons as unknown) as jest.Mock;
const mockRemoveButtons = (removeButtons as unknown) as jest.Mock;
const mockAddMutationListener = (addMutationListener as unknown) as jest.Mock;
const mockRemoveMutationListeners = (removeMutationListeners as unknown) as jest.Mock;

describe("portListener", () => {
  // Setup
  const mockStyleElement = {
    innerHTML: undefined,
  };

  const mockDoc = {
    body: {
      appendChild: jest.fn(),
      removeChild: jest.fn(),
    },
    getElementsByClassName: jest.fn(() => []),
  };

  global.document = (mockDoc as unknown) as Document;
  global.MutationObserver = jest.fn(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
    takeRecords: jest.fn(),
  }));

  beforeEach(() => {
    mockStyleElement.innerHTML = undefined;
    mockDoc.body.appendChild.mockClear();
    mockDoc.body.removeChild.mockClear();
    mockAddButtons.mockClear();
    mockRemoveButtons.mockClear();
    mockAddMutationListener.mockClear();
    mockRemoveMutationListeners.mockClear();
  });

  //=====================================

  it("should take a style element and return a function", () => {
    expect.assertions(1);

    expect(portListener(mockStyleElement)).toBeInstanceOf(Function);
  });

  describe("INITIALIZE", () => {
    it("should add given style rules to style element innerHTML", () => {
      expect.assertions(2);

      expect(mockStyleElement.innerHTML).toBeUndefined();
      const styles = "a-test-string";

      portListener(mockStyleElement)({
        type: ScriptCommand.INITIALIZE,
        payload: { styles },
      });

      expect(mockStyleElement.innerHTML).toEqual(styles);
    });

    it("should throw an error if given style rules are not a string", () => {
      expect.assertions(3);

      expect(mockStyleElement.innerHTML).toBeUndefined();
      const styles = ["a-test-string"];

      expect(() => {
        portListener(mockStyleElement)({
          type: ScriptCommand.INITIALIZE,
          payload: { styles },
        });
      }).toThrow();

      expect(mockStyleElement.innerHTML).toBeUndefined();
    });

    it("should append style element to document body if enabled: true", () => {
      expect.assertions(3);

      expect(mockDoc.body.appendChild).not.toHaveBeenCalled();

      portListener(mockStyleElement)({
        type: ScriptCommand.INITIALIZE,
        payload: { styles: "a-test-string", enabled: true },
      });

      expect(mockDoc.body.appendChild).toHaveBeenCalledTimes(1);
      expect(mockDoc.body.appendChild).toHaveBeenCalledWith(mockStyleElement);
    });

    it("should not append style element to document body if enabled: false", () => {
      expect.assertions(2);

      expect(mockDoc.body.appendChild).not.toHaveBeenCalled();

      portListener(mockStyleElement)({
        type: ScriptCommand.INITIALIZE,
        payload: { styles: "a-test-string", enabled: false },
      });

      expect(mockDoc.body.appendChild).not.toHaveBeenCalled();
    });

    it("should call addButtons if enabled: true", () => {
      expect.assertions(2);

      expect(mockAddButtons).not.toHaveBeenCalled();

      portListener(mockStyleElement)({
        type: ScriptCommand.INITIALIZE,
        payload: { styles: "a-test-string", enabled: true },
      });

      expect(mockAddButtons).toHaveBeenCalledTimes(1);
    });

    it("should call addMutationListener if enabled :true", () => {
      expect.assertions(2);

      expect(mockAddMutationListener).not.toHaveBeenCalled();

      portListener(mockStyleElement)({
        type: ScriptCommand.INITIALIZE,
        payload: { styles: "a-test-string", enabled: true },
      });

      expect(mockAddMutationListener).toHaveBeenCalledTimes(1);
    });

    it("should not call addButtons if enabled: false", () => {
      expect.assertions(2);

      expect(mockAddButtons).not.toHaveBeenCalled();

      portListener(mockStyleElement)({
        type: ScriptCommand.INITIALIZE,
        payload: { styles: "a-test-string", enabled: false },
      });

      expect(mockAddButtons).not.toHaveBeenCalled();
    });

    it("should call addMutationListener if enabled :false", () => {
      expect.assertions(2);

      expect(mockAddMutationListener).not.toHaveBeenCalled();

      portListener(mockStyleElement)({
        type: ScriptCommand.INITIALIZE,
        payload: { styles: "a-test-string", enabled: false },
      });

      expect(mockAddMutationListener).not.toHaveBeenCalled();
    });
  });

  describe("NEW_STYLE_RULES", () => {
    it("should replace style element innerHTML with given style rules", () => {
      expect.assertions(3);

      expect(mockStyleElement.innerHTML).toBeUndefined();

      const styleRules1 = "test-string-1";
      const styleRules2 = "test-string-2";
      portListener(mockStyleElement)({
        type: ScriptCommand.NEW_STYLE_RULES,
        payload: styleRules1,
      });
      expect(mockStyleElement.innerHTML).toEqual(styleRules1);
      portListener(mockStyleElement)({
        type: ScriptCommand.NEW_STYLE_RULES,
        payload: styleRules2,
      });
      expect(mockStyleElement.innerHTML).toEqual(styleRules2);
    });

    it("should throw an error if given style rules are not a string ", () => {
      expect.assertions(3);

      expect(mockStyleElement.innerHTML).toBeUndefined();
      const styles = ["a-test-string"];

      expect(() => {
        portListener(mockStyleElement)({
          type: ScriptCommand.NEW_STYLE_RULES,
          payload: styles,
        });
      }).toThrow();

      expect(mockStyleElement.innerHTML).toBeUndefined();
    });
  });

  describe("ENABLE", () => {
    it("should append style element to document body", () => {
      expect.assertions(3);
      expect(mockDoc.body.appendChild).not.toHaveBeenCalled();

      portListener(mockStyleElement)({
        type: ScriptCommand.ENABLE,
      });

      expect(mockDoc.body.appendChild).toHaveBeenCalledTimes(1);
      expect(mockDoc.body.appendChild).toHaveBeenCalledWith(mockStyleElement);
    });

    it("should call addButtons (ENABLE)", () => {
      expect.assertions(2);

      expect(mockAddButtons).not.toHaveBeenCalled();
      portListener(mockStyleElement)({
        type: ScriptCommand.ENABLE,
      });

      expect(mockAddButtons).toHaveBeenCalledTimes(1);
    });

    it("should call addMutationListener (ENABLE)", () => {
      expect.assertions(2);

      expect(mockAddMutationListener).not.toHaveBeenCalled();
      portListener(mockStyleElement)({
        type: ScriptCommand.ENABLE,
      });

      expect(mockAddMutationListener).toHaveBeenCalledTimes(1);
    });
  });

  describe("DISABLE", () => {
    it("should remove style element from document body", () => {
      expect.assertions(3);
      expect(mockDoc.body.removeChild).not.toHaveBeenCalled();

      portListener(mockStyleElement)({
        type: ScriptCommand.DISABLE,
      });

      expect(mockDoc.body.removeChild).toHaveBeenCalledTimes(1);
      expect(mockDoc.body.removeChild).toHaveBeenCalledWith(mockStyleElement);
    });

    it("should call removeButtons", () => {
      expect.assertions(2);

      expect(mockRemoveButtons).not.toHaveBeenCalled();

      portListener(mockStyleElement)({
        type: ScriptCommand.DISABLE,
      });

      expect(mockRemoveButtons).toHaveBeenCalledTimes(1);
    });

    it("should call removeMutationListeners", () => {
      expect.assertions(2);

      expect(mockRemoveMutationListeners).not.toHaveBeenCalled();

      portListener(mockStyleElement)({
        type: ScriptCommand.DISABLE,
      });

      expect(mockRemoveMutationListeners).toHaveBeenCalledTimes(1);
    });
  });
});
