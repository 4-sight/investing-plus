import { Context } from "../";
import { ScriptState } from "../ScriptState";
import { defaults } from "../../testHelpers";
import { getBlockingStyles } from "../../styleActions/userBlocking";

describe("Context", () => {
  // Setup
  const mockStyleElement = {
    innerHTML: undefined,
  };

  const mockDoc = {
    createElement: jest.fn(() => mockStyleElement),
    body: {
      appendChild: jest.fn(),
      removeChild: jest.fn(),
    },
  };

  global.document = (mockDoc as unknown) as Document;

  beforeEach(() => {
    mockStyleElement.innerHTML = undefined;
    mockDoc.createElement.mockClear();
    mockDoc.body.appendChild.mockClear();
    mockDoc.body.removeChild.mockClear();
  });

  //=============================================

  it("should be a class", () => {
    expect.assertions(1);

    const c = new Context();
    expect(c).toBeInstanceOf(Context);
  });

  it("should create a style element", () => {
    expect.assertions(3);
    expect(mockDoc.createElement).not.toHaveBeenCalled();

    new Context();

    expect(mockDoc.createElement).toHaveBeenCalledTimes(1);
    expect(mockDoc.createElement).toHaveBeenCalledWith("style");
  });

  describe("method - initializeStyles", () => {
    it("should call appendChild, with the expected style rules", () => {
      expect.assertions(4);
      const blockingStyleRules = getBlockingStyles(
        defaults.store.blackList.map((user) => user.id)
      );

      expect(mockDoc.body.appendChild).not.toHaveBeenCalled();

      const c = new Context();

      expect(mockDoc.body.appendChild).not.toHaveBeenCalled();

      c.initializeStyles(new ScriptState(defaults.store));

      expect(mockDoc.body.appendChild).toHaveBeenCalledTimes(1);
      expect(
        mockDoc.body.appendChild.mock.calls[0][0].innerHTML.includes(
          blockingStyleRules
        )
      ).toBe(true);
    });
  });

  describe("method - enable", () => {
    it("should call document.body.appendChild", () => {
      expect.assertions(2);

      const c = new Context();

      expect(mockDoc.body.appendChild).not.toHaveBeenCalled();

      c.enable();

      expect(mockDoc.body.appendChild).toHaveBeenCalledTimes(1);
    });
  });

  describe("method - disable", () => {
    it("should call removeChild", () => {
      expect.assertions(2);

      const c = new Context();

      expect(mockDoc.body.removeChild).not.toHaveBeenCalled();

      c.disable();

      expect(mockDoc.body.removeChild).toHaveBeenCalledTimes(1);
    });
  });

  describe("method - blocking.enable", () => {
    it("should call appendChild with the expected style rules(1)", () => {
      expect.assertions(4);
      const blockingStyleRules = getBlockingStyles(
        defaults.store.blackList.map((user) => user.id)
      );

      const c = new Context();

      c.initializeStyles(
        new ScriptState({ ...defaults.store, blocking: false })
      );

      expect(mockDoc.body.appendChild).toHaveBeenCalledTimes(1);
      expect(
        mockDoc.body.appendChild.mock.calls[0][0].innerHTML.includes(
          blockingStyleRules
        )
      ).toBe(false);

      c.blocking.enable();

      expect(mockDoc.body.appendChild).toHaveBeenCalledTimes(2);
      expect(
        mockDoc.body.appendChild.mock.calls[0][0].innerHTML.includes(
          blockingStyleRules
        )
      ).toBe(true);
    });
  });

  describe("method - blocking.disable", () => {
    it("should call appendChild with the expected style rules(2)", () => {
      expect.assertions(4);
      const blockingStyleRules = getBlockingStyles(
        defaults.store.blackList.map((user) => user.id)
      );

      const c = new Context();

      c.initializeStyles(new ScriptState({ ...defaults.store }));

      expect(mockDoc.body.appendChild).toHaveBeenCalledTimes(1);
      expect(
        mockDoc.body.appendChild.mock.calls[0][0].innerHTML.includes(
          blockingStyleRules
        )
      ).toBe(true);

      c.blocking.disable();

      expect(mockDoc.body.appendChild).toHaveBeenCalledTimes(2);
      expect(
        mockDoc.body.appendChild.mock.calls[0][0].innerHTML.includes(
          blockingStyleRules
        )
      ).toBe(false);
    });
  });

  describe("method - batchUpdateStyles", () => {
    it("should call appendChild with the expected style rules(3)", () => {
      expect.assertions(4);
      const blockingStyleRules = getBlockingStyles(
        defaults.store.blackList.map((user) => user.id)
      );
      const newUser = {
        name: "new-user",
        id: "12345",
      };
      const newBlockingStyleRules = `${blockingStyleRules} ${getBlockingStyles([
        newUser.id,
      ])}`;

      const c = new Context();
      const baseState = { ...defaults.store };
      const newState = { ...baseState };
      newState.blackList.push(newUser);

      c.initializeStyles(new ScriptState(baseState));

      expect(mockDoc.body.appendChild).toHaveBeenCalledTimes(1);
      expect(
        mockDoc.body.appendChild.mock.calls[0][0].innerHTML.includes(
          blockingStyleRules
        )
      ).toBe(true);

      c.batchUpdateStyles(newState);

      expect(mockDoc.body.appendChild).toHaveBeenCalledTimes(2);
      expect(
        mockDoc.body.appendChild.mock.calls[0][0].innerHTML.includes(
          newBlockingStyleRules
        )
      ).toBe(true);
    });
  });
});
