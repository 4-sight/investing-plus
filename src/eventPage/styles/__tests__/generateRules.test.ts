import { generateRules } from "..";
import { defaults } from "../../../testHelpers";
import { Blocking, StyleRule } from "../../../types";

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
        [StyleRule.BLACKLIST, blackList],
        [StyleRule.WHITELIST, whiteList],
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
        [StyleRule.BLACKLIST, blackList],
        [StyleRule.WHITELIST, whiteList],
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
        [StyleRule.BLACKLIST, blackList],
        [StyleRule.WHITELIST, whiteList],
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
        [StyleRule.BLACKLIST, blackList],
        [StyleRule.WHITELIST, whiteList],
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
        [StyleRule.BLACKLIST, blackList],
        [StyleRule.WHITELIST, whiteList],
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
        [StyleRule.BLACKLIST, blackList],
        [StyleRule.WHITELIST, whiteList],
      ]);

      const rules = generateRules(styleMap1, {
        ...defaults.generalStore,
        blocking: Blocking.NONE,
      });

      expect(rules).not.toContain(blackList);
    });
  });

  describe("highlighting.blocked: true", () => {
    it("should return a string containing blocked highlighting rules, if blocking: NONE", () => {
      expect.assertions(1);

      const highLightFav = "test-string-7 test-string-8 test-string-9";
      const highLightBlocked = "test-string-10 test-string-11 test-string-12";
      const styleMap1 = new Map([
        [StyleRule.HIGHLIGHT_FAVOURITE, highLightFav],
        [StyleRule.HIGHLIGHT_BLOCKED, highLightBlocked],
      ]);

      const rules = generateRules(styleMap1, {
        ...defaults.generalStore,
        blocking: Blocking.NONE,
        highlightBlocked: true,
      });

      expect(rules).toContain(highLightBlocked);
    });

    it("should not return a string containing blocked highlighting rules, if blocking: BLACKLIST/WHITELIST", () => {
      expect.assertions(2);

      const highLightFav = "test-string-7 test-string-8 test-string-9";
      const highLightBlocked = "test-string-10 test-string-11 test-string-12";
      const styleMap1 = new Map([
        [StyleRule.HIGHLIGHT_FAVOURITE, highLightFav],
        [StyleRule.HIGHLIGHT_BLOCKED, highLightBlocked],
      ]);

      const rules1 = generateRules(styleMap1, {
        ...defaults.generalStore,
        blocking: Blocking.WHITELIST,
        highlightBlocked: true,
      });
      const rules2 = generateRules(styleMap1, {
        ...defaults.generalStore,
        blocking: Blocking.BLACKLIST,
        highlightBlocked: true,
      });

      expect(rules1).not.toContain(highLightBlocked);
      expect(rules2).not.toContain(highLightBlocked);
    });
  });

  describe("highlighting.favourite: true", () => {
    it("should return a string containing favourite highlighting rules, if blocking: BLACKLIST/NONE", () => {
      expect.assertions(2);

      const highLightFav = "test-string-7 test-string-8 test-string-9";
      const highLightBlocked = "test-string-10 test-string-11 test-string-12";
      const styleMap1 = new Map([
        [StyleRule.HIGHLIGHT_FAVOURITE, highLightFav],
        [StyleRule.HIGHLIGHT_BLOCKED, highLightBlocked],
      ]);

      const rules1 = generateRules(styleMap1, {
        ...defaults.generalStore,
        blocking: Blocking.BLACKLIST,
        highlightFavourite: true,
      });
      const rules2 = generateRules(styleMap1, {
        ...defaults.generalStore,
        blocking: Blocking.NONE,
        highlightFavourite: true,
      });

      expect(rules1).toContain(highLightFav);
      expect(rules2).toContain(highLightFav);
    });

    it("should not return a string containing favourite highlighting rules, if blocking: WHITELIST", () => {
      expect.assertions(1);

      const highLightFav = "test-string-7 test-string-8 test-string-9";
      const highLightBlocked = "test-string-10 test-string-11 test-string-12";
      const styleMap1 = new Map([
        [StyleRule.HIGHLIGHT_FAVOURITE, highLightFav],
        [StyleRule.HIGHLIGHT_BLOCKED, highLightBlocked],
      ]);

      const rules = generateRules(styleMap1, {
        ...defaults.generalStore,
        blocking: Blocking.WHITELIST,
        highlightFavourite: true,
      });

      expect(rules).not.toContain(highLightFav);
    });
  });
});
