import { Context } from "../";
import { ScriptState } from "../ScriptState";
import { defaults } from "../../testHelpers";
import { getBlackListStyles } from "../../styleActions/blackList";
import { getWhiteListStyles } from "../../styleActions/whiteList";
import { Blocking } from "../../types";

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
      const blackListStyleRules = getBlackListStyles(
        defaults.store.blackList.map((user) => user.id)
      );

      expect(mockDoc.body.appendChild).not.toHaveBeenCalled();

      const c = new Context();

      expect(mockDoc.body.appendChild).not.toHaveBeenCalled();

      c.initializeStyles(
        new ScriptState({ ...defaults.store, blocking: Blocking.BLACKLIST })
      );

      expect(mockDoc.body.appendChild).toHaveBeenCalledTimes(1);
      expect(
        mockDoc.body.appendChild.mock.calls[0][0].innerHTML.includes(
          blackListStyleRules
        )
      ).toBe(true);
    });
  });

  describe("method - batchUpdateStyles", () => {
    it("should call appendChild with the expected style rules(3)", () => {
      expect.assertions(4);
      const blackListStyleRules = getBlackListStyles(
        defaults.store.blackList.map((user) => user.id)
      );
      const newUser = {
        name: "new-user",
        id: "12345",
      };
      const newblackListStyleRules = `${blackListStyleRules} ${getBlackListStyles(
        [newUser.id]
      )}`;

      const c = new Context();
      const baseState = { ...defaults.store, blocking: Blocking.BLACKLIST };
      const newState = { ...baseState };
      newState.blackList.push(newUser);

      c.initializeStyles(new ScriptState(baseState));

      expect(mockDoc.body.appendChild).toHaveBeenCalledTimes(1);
      expect(
        mockDoc.body.appendChild.mock.calls[0][0].innerHTML.includes(
          blackListStyleRules
        )
      ).toBe(true);

      c.batchUpdateStyles(newState);

      expect(mockDoc.body.appendChild).toHaveBeenCalledTimes(2);
      expect(
        mockDoc.body.appendChild.mock.calls[0][0].innerHTML.includes(
          newblackListStyleRules
        )
      ).toBe(true);
    });
  });

  describe("method - enable", () => {
    it("should call document.body.appendChild", () => {
      expect.assertions(2);

      const c = new Context();
      c.initializeStyles(
        new ScriptState({ ...defaults.store, enabled: false })
      );

      expect(mockDoc.body.appendChild).not.toHaveBeenCalled();

      c.enable();

      expect(mockDoc.body.appendChild).toHaveBeenCalledTimes(1);
    });
  });

  describe("method - disable", () => {
    it("should call removeChild", () => {
      expect.assertions(2);

      const c = new Context();
      c.initializeStyles(new ScriptState(defaults.store));

      expect(mockDoc.body.removeChild).not.toHaveBeenCalled();

      c.disable();

      expect(mockDoc.body.removeChild).toHaveBeenCalledTimes(1);
    });
  });

  describe("method - setBlocking", () => {
    describe("blocking: BLACKLIST", () => {
      it("should call appendChild with the expected style rules(1)", () => {
        expect.assertions(6);
        const blackListStyleRules = getBlackListStyles(
          defaults.store.blackList.map((user) => user.id)
        );
        const whiteListStyleRules = getWhiteListStyles(
          defaults.store.whiteList.map((user) => user.id)
        );

        const c = new Context();

        c.initializeStyles(
          new ScriptState({ ...defaults.store, blocking: Blocking.NONE })
        );

        expect(mockDoc.body.appendChild).toHaveBeenCalledTimes(1);
        expect(
          mockDoc.body.appendChild.mock.calls[0][0].innerHTML.includes(
            blackListStyleRules
          )
        ).toBe(false);
        expect(
          mockDoc.body.appendChild.mock.calls[0][0].innerHTML.includes(
            whiteListStyleRules
          )
        ).toBe(false);

        c.setBlocking(Blocking.BLACKLIST);

        expect(mockDoc.body.appendChild).toHaveBeenCalledTimes(2);
        expect(
          mockDoc.body.appendChild.mock.calls[0][0].innerHTML.includes(
            blackListStyleRules
          )
        ).toBe(true);
        expect(
          mockDoc.body.appendChild.mock.calls[0][0].innerHTML.includes(
            whiteListStyleRules
          )
        ).toBe(false);
      });
    });
  });

  describe("blocking: WHITELIST", () => {
    it("should call appendChild with the expected style rules(2)", () => {
      expect.assertions(6);
      const blackListStyleRules = getBlackListStyles(
        defaults.store.blackList.map((user) => user.id)
      );
      const whiteListStyleRules = getWhiteListStyles(
        defaults.store.whiteList.map((user) => user.id)
      );

      const c = new Context();

      c.initializeStyles(
        new ScriptState({ ...defaults.store, blocking: Blocking.NONE })
      );

      expect(mockDoc.body.appendChild).toHaveBeenCalledTimes(1);
      expect(
        mockDoc.body.appendChild.mock.calls[0][0].innerHTML.includes(
          blackListStyleRules
        )
      ).toBe(false);
      expect(
        mockDoc.body.appendChild.mock.calls[0][0].innerHTML.includes(
          whiteListStyleRules
        )
      ).toBe(false);

      c.setBlocking(Blocking.WHITELIST);

      expect(mockDoc.body.appendChild).toHaveBeenCalledTimes(2);
      expect(
        mockDoc.body.appendChild.mock.calls[0][0].innerHTML.includes(
          blackListStyleRules
        )
      ).toBe(false);
      expect(
        mockDoc.body.appendChild.mock.calls[0][0].innerHTML.includes(
          whiteListStyleRules
        )
      ).toBe(true);
    });
  });

  describe("`blocking: NONE`", () => {
    it("should call appendChild with the expected style rules(3)", () => {
      expect.assertions(12);
      const blackListStyleRules = getBlackListStyles(
        defaults.store.blackList.map((user) => user.id)
      );
      const whiteListStyleRules = getWhiteListStyles(
        defaults.store.whiteList.map((user) => user.id)
      );

      const c = new Context();

      c.initializeStyles(
        new ScriptState({ ...defaults.store, blocking: Blocking.BLACKLIST })
      );

      expect(mockDoc.body.appendChild).toHaveBeenCalledTimes(1);
      expect(
        mockDoc.body.appendChild.mock.calls[0][0].innerHTML.includes(
          blackListStyleRules
        )
      ).toBe(true);
      expect(
        mockDoc.body.appendChild.mock.calls[0][0].innerHTML.includes(
          whiteListStyleRules
        )
      ).toBe(false);

      c.setBlocking(Blocking.NONE);

      expect(mockDoc.body.appendChild).toHaveBeenCalledTimes(2);
      expect(
        mockDoc.body.appendChild.mock.calls[0][0].innerHTML.includes(
          blackListStyleRules
        )
      ).toBe(false);
      expect(
        mockDoc.body.appendChild.mock.calls[0][0].innerHTML.includes(
          whiteListStyleRules
        )
      ).toBe(false);

      c.setBlocking(Blocking.WHITELIST);

      expect(mockDoc.body.appendChild).toHaveBeenCalledTimes(3);
      expect(
        mockDoc.body.appendChild.mock.calls[0][0].innerHTML.includes(
          blackListStyleRules
        )
      ).toBe(false);
      expect(
        mockDoc.body.appendChild.mock.calls[0][0].innerHTML.includes(
          whiteListStyleRules
        )
      ).toBe(true);

      c.setBlocking(Blocking.NONE);

      expect(mockDoc.body.appendChild).toHaveBeenCalledTimes(4);
      expect(
        mockDoc.body.appendChild.mock.calls[0][0].innerHTML.includes(
          blackListStyleRules
        )
      ).toBe(false);
      expect(
        mockDoc.body.appendChild.mock.calls[0][0].innerHTML.includes(
          whiteListStyleRules
        )
      ).toBe(false);
    });
  });
});
