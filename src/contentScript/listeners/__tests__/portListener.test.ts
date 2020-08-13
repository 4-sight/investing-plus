import { portListener } from "..";
import { ScriptCommand } from "../../../types";
import { createElement } from "react";

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
  };

  global.document = (mockDoc as unknown) as Document;

  beforeEach(() => {
    mockStyleElement.innerHTML = undefined;
    mockDoc.body.appendChild.mockClear();
    mockDoc.body.removeChild.mockClear();
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
  });
});
