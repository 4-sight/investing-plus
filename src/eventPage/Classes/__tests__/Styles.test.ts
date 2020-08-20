import { Styles } from "..";
import { GeneralStore } from "../GeneralStore";
import { UsersStore } from "../UsersStore";
import { defaults } from "../../../testHelpers";
import {
  blackListStyles,
  whiteListStyles,
  highlightBlockedStyles,
  highlightFavouriteStyles,
  generateRules,
} from "../../styles";
import { StyleRule } from "../../../types";

jest.mock("../../styles/generateRules", () => ({
  generateRules: jest.fn(() => "test-string"),
}));
jest.mock("../../styles/blackListStyles", () => ({
  blackListStyles: jest.fn(() => "test-black-list-styles"),
}));
jest.mock("../../styles/whiteListStyles", () => ({
  whiteListStyles: jest.fn(() => "test-white-list-styles"),
}));
jest.mock("../../styles/highlightBlockedStyles", () => ({
  highlightBlockedStyles: jest.fn(() => "test-highlight-blocked-styles"),
}));
jest.mock("../../styles/highlightFavouriteStyles", () => ({
  highlightFavouriteStyles: jest.fn(() => "test-highlight-favourite-styles"),
}));

const mockGenerateRules = (generateRules as unknown) as jest.Mock;
const mockBlackListStyles = (blackListStyles as unknown) as jest.Mock;
const mockWhiteListStyles = (whiteListStyles as unknown) as jest.Mock;
const mockHighlightBlockedStyles = (highlightBlockedStyles as unknown) as jest.Mock;
const mockHighlightFavouriteStyles = (highlightFavouriteStyles as unknown) as jest.Mock;

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
    mockBlackListStyles.mockClear();
    mockWhiteListStyles.mockClear();
    mockHighlightBlockedStyles.mockClear();
    mockHighlightFavouriteStyles.mockClear();
  });

  //=======================================

  describe("Method - getStyleRules", () => {
    it("should return the rules from generateRules", () => {
      expect.assertions(11);

      expect(mockBlackListStyles).not.toHaveBeenCalled();
      expect(mockWhiteListStyles).not.toHaveBeenCalled();
      expect(mockHighlightBlockedStyles).not.toHaveBeenCalled();
      expect(mockHighlightFavouriteStyles).not.toHaveBeenCalled();
      expect(mockGenerateRules).not.toHaveBeenCalled();

      const styles = new Styles({ ...defaults.generalStore }, [], []);

      expect(mockBlackListStyles).toHaveBeenCalledTimes(1);
      expect(mockWhiteListStyles).toHaveBeenCalledTimes(1);
      expect(mockHighlightBlockedStyles).toHaveBeenCalledTimes(1);
      expect(mockHighlightFavouriteStyles).toHaveBeenCalledTimes(1);
      expect(mockGenerateRules).toHaveBeenCalledTimes(1);

      expect(styles.getStyleRules()).toEqual("test-string");
    });
  });

  describe("Method - updateStyles", () => {
    it("should recreate all styleRules and return the given string (2)", () => {
      expect.assertions(16);

      expect(mockBlackListStyles).not.toHaveBeenCalled();
      expect(mockWhiteListStyles).not.toHaveBeenCalled();
      expect(mockHighlightBlockedStyles).not.toHaveBeenCalled();
      expect(mockHighlightFavouriteStyles).not.toHaveBeenCalled();
      expect(mockGenerateRules).not.toHaveBeenCalled();

      const styles = new Styles({ ...defaults.generalStore }, [], []);

      expect(mockBlackListStyles).toHaveBeenCalledTimes(1);
      expect(mockWhiteListStyles).toHaveBeenCalledTimes(1);
      expect(mockHighlightBlockedStyles).toHaveBeenCalledTimes(1);
      expect(mockHighlightFavouriteStyles).toHaveBeenCalledTimes(1);
      expect(mockGenerateRules).toHaveBeenCalledTimes(1);

      expect(styles.updateStyles({ ...defaults.generalStore }, [], [])).toEqual(
        "test-string"
      );

      expect(mockBlackListStyles).toHaveBeenCalledTimes(2);
      expect(mockWhiteListStyles).toHaveBeenCalledTimes(2);
      expect(mockHighlightBlockedStyles).toHaveBeenCalledTimes(2);
      expect(mockHighlightFavouriteStyles).toHaveBeenCalledTimes(2);
      expect(mockGenerateRules).toHaveBeenCalledTimes(2);
    });
  });

  describe("Method - updateBlackList", () => {
    it("should recreate blackList and highlightBlocked styles, return the given string", () => {
      expect.assertions(16);

      expect(mockBlackListStyles).not.toHaveBeenCalled();
      expect(mockWhiteListStyles).not.toHaveBeenCalled();
      expect(mockHighlightBlockedStyles).not.toHaveBeenCalled();
      expect(mockHighlightFavouriteStyles).not.toHaveBeenCalled();
      expect(mockGenerateRules).not.toHaveBeenCalled();

      const styles = new Styles({ ...defaults.generalStore }, [], []);

      expect(mockBlackListStyles).toHaveBeenCalledTimes(1);
      expect(mockWhiteListStyles).toHaveBeenCalledTimes(1);
      expect(mockHighlightBlockedStyles).toHaveBeenCalledTimes(1);
      expect(mockHighlightFavouriteStyles).toHaveBeenCalledTimes(1);
      expect(mockGenerateRules).toHaveBeenCalledTimes(1);

      expect(styles.updateBlackList([], { ...defaults.generalStore })).toEqual(
        "test-string"
      );

      expect(mockBlackListStyles).toHaveBeenCalledTimes(2);
      expect(mockWhiteListStyles).toHaveBeenCalledTimes(1);
      expect(mockHighlightBlockedStyles).toHaveBeenCalledTimes(2);
      expect(mockHighlightFavouriteStyles).toHaveBeenCalledTimes(1);
      expect(mockGenerateRules).toHaveBeenCalledTimes(2);
    });
  });

  describe("Method - updateWhiteList", () => {
    it("should recreate whiteList and highlightFavourite styles, and return the given string", () => {
      expect.assertions(16);

      expect(mockBlackListStyles).not.toHaveBeenCalled();
      expect(mockWhiteListStyles).not.toHaveBeenCalled();
      expect(mockHighlightBlockedStyles).not.toHaveBeenCalled();
      expect(mockHighlightFavouriteStyles).not.toHaveBeenCalled();
      expect(mockGenerateRules).not.toHaveBeenCalled();

      const styles = new Styles({ ...defaults.generalStore }, [], []);

      expect(mockBlackListStyles).toHaveBeenCalledTimes(1);
      expect(mockWhiteListStyles).toHaveBeenCalledTimes(1);
      expect(mockHighlightBlockedStyles).toHaveBeenCalledTimes(1);
      expect(mockHighlightFavouriteStyles).toHaveBeenCalledTimes(1);
      expect(mockGenerateRules).toHaveBeenCalledTimes(1);

      expect(styles.updateWhiteList([], { ...defaults.generalStore })).toEqual(
        "test-string"
      );

      expect(mockBlackListStyles).toHaveBeenCalledTimes(1);
      expect(mockWhiteListStyles).toHaveBeenCalledTimes(2);
      expect(mockHighlightBlockedStyles).toHaveBeenCalledTimes(1);
      expect(mockHighlightFavouriteStyles).toHaveBeenCalledTimes(2);
      expect(mockGenerateRules).toHaveBeenCalledTimes(2);
    });
  });
});
