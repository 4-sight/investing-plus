import { generateRules } from "..";
import { defaults } from "../../../testHelpers";
import { Blocking } from "../../../types";

describe("generateRules", () => {
  it("should return a string", () => {
    expect.assertions(1);

    expect(typeof generateRules(new Map(), defaults.generalStore)).toBe(
      "string"
    );
  });

  it("should an empty string for an empty style map", () => {
    expect.assertions(1);

    expect(generateRules(new Map(), defaults.generalStore)).toEqual("");
  });

  describe("blocking: BLACKLIST", () => {
    it("should return a string containing the blackList from the style map", () => {
      expect.assertions(1);

      const blackList = "test-string-1 test-string-2 test-string-3";
      const whiteList = "test-string-4 test-string-5 test-string-6";
      const styleMap1 = new Map([
        ["blackList", blackList],
        ["whiteList", whiteList],
      ]);

      const rules = generateRules(styleMap1, {
        ...defaults.generalStore,
        blocking: Blocking.BLACKLIST,
      });

      expect(rules).toContain(blackList);
    });

    it("should return a string not containing the whiteList from the style map", () => {
      expect.assertions(1);

      const blackList = "test-string-1 test-string-2 test-string-3";
      const whiteList = "test-string-4 test-string-5 test-string-6";
      const styleMap1 = new Map([
        ["blackList", blackList],
        ["whiteList", whiteList],
      ]);

      const rules = generateRules(styleMap1, {
        ...defaults.generalStore,
        blocking: Blocking.BLACKLIST,
      });

      expect(rules).not.toContain(whiteList);
    });
  });

  describe("blocking: WHITELIST", () => {
    it("should return a string containing the whiteList from the style map", () => {
      expect.assertions(1);

      const blackList = "test-string-1 test-string-2 test-string-3";
      const whiteList = "test-string-4 test-string-5 test-string-6";
      const styleMap1 = new Map([
        ["blackList", blackList],
        ["whiteList", whiteList],
      ]);

      const rules = generateRules(styleMap1, {
        ...defaults.generalStore,
        blocking: Blocking.WHITELIST,
      });

      expect(rules).toContain(whiteList);
    });

    it("should return a string not containing the blackList from the style map", () => {
      expect.assertions(1);

      const blackList = "test-string-1 test-string-2 test-string-3";
      const whiteList = "test-string-4 test-string-5 test-string-6";
      const styleMap1 = new Map([
        ["blackList", blackList],
        ["whiteList", whiteList],
      ]);

      const rules = generateRules(styleMap1, {
        ...defaults.generalStore,
        blocking: Blocking.WHITELIST,
      });

      expect(rules).not.toContain(blackList);
    });
  });

  describe("blocking: NONE", () => {
    it("should return a string not containing the whiteList from the style map.", () => {
      expect.assertions(1);

      const blackList = "test-string-1 test-string-2 test-string-3";
      const whiteList = "test-string-4 test-string-5 test-string-6";
      const styleMap1 = new Map([
        ["blackList", blackList],
        ["whiteList", whiteList],
      ]);

      const rules = generateRules(styleMap1, {
        ...defaults.generalStore,
        blocking: Blocking.NONE,
      });

      expect(rules).not.toContain(whiteList);
    });

    it("should return a string not containing the blackList from the style map.", () => {
      expect.assertions(1);

      const blackList = "test-string-1 test-string-2 test-string-3";
      const whiteList = "test-string-4 test-string-5 test-string-6";
      const styleMap1 = new Map([
        ["blackList", blackList],
        ["whiteList", whiteList],
      ]);

      const rules = generateRules(styleMap1, {
        ...defaults.generalStore,
        blocking: Blocking.NONE,
      });

      expect(rules).not.toContain(blackList);
    });
  });
});
