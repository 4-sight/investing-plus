import { Styles } from "..";
import { GeneralStore } from "../GeneralStore";
import { UsersStore } from "../UsersStore";
import { defaults } from "../../../testHelpers";
import { generateRules } from "../../styles/generateRules";
import { StyleRule } from "../../../types";

jest.mock("../../styles/generateRules", () => ({
  generateRules: jest.fn(() => "test-string"),
}));
const mockGenerateRules = (generateRules as unknown) as jest.Mock;

describe("Styles", () => {
  // Setup

  let mockGenStore: GeneralStore;
  let mockBlackList: UsersStore;
  let mockWhiteList: UsersStore;

  beforeEach(() => {
    mockGenStore = new GeneralStore(defaults.generalStore);
    mockBlackList = new UsersStore("blackList", defaults.userList());
    mockWhiteList = new UsersStore("whiteList", defaults.userList());
    mockGenerateRules.mockClear();
  });

  //=======================================

  describe("Method - getStyleRules", () => {
    it("should call generateRules with a styleMap and return the given string (1)", () => {
      expect.assertions(5);

      expect(mockGenerateRules).not.toHaveBeenCalled();

      const styles = new Styles(
        mockGenStore.getState(),
        [
          { id: "555-1", name: "test-black-1" },
          { id: "555-2", name: "test-black-2" },
          { id: "555-3", name: "test-black-3" },
        ],
        [
          { id: "555-4", name: "test-white-4" },
          { id: "555-5", name: "test-white-5" },
          { id: "555-6", name: "test-white-6" },
        ]
      );
      const styleRules = styles.getStyleRules();
      const expectedStyleMap = new Map();
      const blackListStyles =
        '.js-comment[data-user-id="555-1"] {display: none;} .js-comment[data-user-id="555-2"] {display: none;} .js-comment[data-user-id="555-3"] {display: none;}';
      const whiteListStyles =
        '.js-comment {display: none;} .js-comment[data-user-id="555-4"] {display: block;} .js-comment[data-user-id="555-5"] {display: block;} .js-comment[data-user-id="555-6"] {display: block;}';
      const highlightBlockedStyles =
        '.js-comment[data-user-id="555-1"] {border: 2px solid red;} .js-comment[data-user-id="555-2"] {border: 2px solid red;} .js-comment[data-user-id="555-3"] {border: 2px solid red;}';
      const highlightFavouriteStyles =
        '.js-comment[data-user-id="555-4"] {border: 2px solid blue;} .js-comment[data-user-id="555-5"] {border: 2px solid blue;} .js-comment[data-user-id="555-6"] {border: 2px solid blue;}';
      expectedStyleMap.set(StyleRule.BLACKLIST, blackListStyles);
      expectedStyleMap.set(StyleRule.WHITELIST, whiteListStyles);
      expectedStyleMap.set(StyleRule.HIGHLIGHT_BLOCKED, highlightBlockedStyles);
      expectedStyleMap.set(
        StyleRule.HIGHLIGHT_FAVOURITE,
        highlightFavouriteStyles
      );

      expect(typeof styleRules).toBe("string");
      expect(styleRules).toEqual("test-string");

      expect(mockGenerateRules).toHaveBeenCalledTimes(1);
      expect(mockGenerateRules).toHaveBeenCalledWith(
        expectedStyleMap,
        mockGenStore.getState()
      );
    });
  });

  describe("Method - updateStyles", () => {
    it("should call generateRules with a styleMap and return the given string (2)", () => {
      expect.assertions(7);

      expect(mockGenerateRules).not.toHaveBeenCalled();
      const styles = new Styles(mockGenStore.getState(), [], []);
      expect(mockGenerateRules).toHaveBeenCalledTimes(1);
      expect(mockGenerateRules).toHaveBeenCalledWith(
        new Map([
          [StyleRule.BLACKLIST, ""],
          [StyleRule.WHITELIST, ""],
          [StyleRule.HIGHLIGHT_BLOCKED, ""],
          [StyleRule.HIGHLIGHT_FAVOURITE, ""],
        ]),
        mockGenStore.getState()
      );
      const blackList = [
        { id: "555-1", name: "test-black-1" },
        { id: "555-2", name: "test-black-2" },
        { id: "555-3", name: "test-black-3" },
      ];

      const whiteList = [
        { id: "555-4", name: "test-white-4" },
        { id: "555-5", name: "test-white-5" },
        { id: "555-6", name: "test-white-6" },
      ];

      const styleRules = styles.updateStyles(
        mockGenStore.getState(),
        blackList,
        whiteList
      );
      const expectedStyleMap = new Map();
      const blackListStyles =
        '.js-comment[data-user-id="555-1"] {display: none;} .js-comment[data-user-id="555-2"] {display: none;} .js-comment[data-user-id="555-3"] {display: none;}';
      const whiteListStyles =
        '.js-comment {display: none;} .js-comment[data-user-id="555-4"] {display: block;} .js-comment[data-user-id="555-5"] {display: block;} .js-comment[data-user-id="555-6"] {display: block;}';
      const highlightBlockedStyles =
        '.js-comment[data-user-id="555-1"] {border: 2px solid red;} .js-comment[data-user-id="555-2"] {border: 2px solid red;} .js-comment[data-user-id="555-3"] {border: 2px solid red;}';
      const highlightFavouriteStyles =
        '.js-comment[data-user-id="555-4"] {border: 2px solid blue;} .js-comment[data-user-id="555-5"] {border: 2px solid blue;} .js-comment[data-user-id="555-6"] {border: 2px solid blue;}';
      expectedStyleMap.set(StyleRule.BLACKLIST, blackListStyles);
      expectedStyleMap.set(StyleRule.WHITELIST, whiteListStyles);
      expectedStyleMap.set(StyleRule.HIGHLIGHT_BLOCKED, highlightBlockedStyles);
      expectedStyleMap.set(
        StyleRule.HIGHLIGHT_FAVOURITE,
        highlightFavouriteStyles
      );

      expect(typeof styleRules).toBe("string");
      expect(styleRules).toEqual("test-string");

      expect(mockGenerateRules).toHaveBeenCalledTimes(2);
      expect(mockGenerateRules).toHaveBeenLastCalledWith(
        expectedStyleMap,
        mockGenStore.getState()
      );
    });
  });

  describe("Method - updateBlackList", () => {
    it("should call generateRules with a styleMap and return the given string (3)", () => {
      expect.assertions(7);

      expect(mockGenerateRules).not.toHaveBeenCalled();
      const styles = new Styles(mockGenStore.getState(), [], []);
      expect(mockGenerateRules).toHaveBeenCalledTimes(1);
      expect(mockGenerateRules).toHaveBeenCalledWith(
        new Map([
          [StyleRule.BLACKLIST, ""],
          [StyleRule.WHITELIST, ""],
          [StyleRule.HIGHLIGHT_BLOCKED, ""],
          [StyleRule.HIGHLIGHT_FAVOURITE, ""],
        ]),
        mockGenStore.getState()
      );
      const blackList = [
        { id: "555-1", name: "test-black-1" },
        { id: "555-2", name: "test-black-2" },
        { id: "555-3", name: "test-black-3" },
      ];

      const styleRules = styles.updateBlackList(
        blackList,
        mockGenStore.getState()
      );
      const expectedStyleMap = new Map();
      const blackListStyles =
        '.js-comment[data-user-id="555-1"] {display: none;} .js-comment[data-user-id="555-2"] {display: none;} .js-comment[data-user-id="555-3"] {display: none;}';
      const highlightBlockedStyles =
        '.js-comment[data-user-id="555-1"] {border: 2px solid red;} .js-comment[data-user-id="555-2"] {border: 2px solid red;} .js-comment[data-user-id="555-3"] {border: 2px solid red;}';
      expectedStyleMap.set(StyleRule.BLACKLIST, blackListStyles);
      expectedStyleMap.set(StyleRule.WHITELIST, "");
      expectedStyleMap.set(StyleRule.HIGHLIGHT_BLOCKED, highlightBlockedStyles);
      expectedStyleMap.set(StyleRule.HIGHLIGHT_FAVOURITE, "");

      expect(typeof styleRules).toBe("string");
      expect(styleRules).toEqual("test-string");

      expect(mockGenerateRules).toHaveBeenCalledTimes(2);
      expect(mockGenerateRules).toHaveBeenLastCalledWith(
        expectedStyleMap,
        mockGenStore.getState()
      );
    });
  });

  describe("Method - updateWhiteList", () => {
    it("should call generateRules with a styleMap and return the given string (4)", () => {
      expect.assertions(7);

      expect(mockGenerateRules).not.toHaveBeenCalled();
      const styles = new Styles(mockGenStore.getState(), [], []);
      expect(mockGenerateRules).toHaveBeenCalledTimes(1);
      expect(mockGenerateRules).toHaveBeenCalledWith(
        new Map([
          [StyleRule.BLACKLIST, ""],
          [StyleRule.WHITELIST, ""],
          [StyleRule.HIGHLIGHT_BLOCKED, ""],
          [StyleRule.HIGHLIGHT_FAVOURITE, ""],
        ]),
        mockGenStore.getState()
      );

      const whiteList = [
        { id: "555-4", name: "test-white-4" },
        { id: "555-5", name: "test-white-5" },
        { id: "555-6", name: "test-white-6" },
      ];

      const styleRules = styles.updateWhiteList(
        whiteList,
        mockGenStore.getState()
      );
      const expectedStyleMap = new Map();
      const whiteListStyles =
        '.js-comment {display: none;} .js-comment[data-user-id="555-4"] {display: block;} .js-comment[data-user-id="555-5"] {display: block;} .js-comment[data-user-id="555-6"] {display: block;}';
      const highlightFavouriteStyles =
        '.js-comment[data-user-id="555-4"] {border: 2px solid blue;} .js-comment[data-user-id="555-5"] {border: 2px solid blue;} .js-comment[data-user-id="555-6"] {border: 2px solid blue;}';
      expectedStyleMap.set(StyleRule.BLACKLIST, "");
      expectedStyleMap.set(StyleRule.WHITELIST, whiteListStyles);
      expectedStyleMap.set(StyleRule.HIGHLIGHT_BLOCKED, "");
      expectedStyleMap.set(
        StyleRule.HIGHLIGHT_FAVOURITE,
        highlightFavouriteStyles
      );

      expect(typeof styleRules).toBe("string");
      expect(styleRules).toEqual("test-string");

      expect(mockGenerateRules).toHaveBeenCalledTimes(2);
      expect(mockGenerateRules).toHaveBeenLastCalledWith(
        expectedStyleMap,
        mockGenStore.getState()
      );
    });
  });
});
