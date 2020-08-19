import {
  StyleMap,
  GeneralStoreState,
  Users,
  User,
  StyleRule,
} from "../../types";
import { generateRules } from "../styles";

export class Styles {
  private styleMap: StyleMap = new Map();
  private styleRules: string = "";

  constructor(genState: GeneralStoreState, blackList: Users, whiteList: Users) {
    this.createBlackListStyles(blackList);
    this.createWhiteListStyles(whiteList);
    this.createHighlightBlockedStyles(blackList);
    this.createHighlightFavouriteStyles(whiteList);
    this.updateStyleRules(genState);
  }

  private updateStyleRules = (genState: GeneralStoreState) => {
    this.styleRules = generateRules(this.styleMap, genState);
  };

  private createBlackListStyles = (blackList: Users) => {
    this.styleMap.set(
      StyleRule.BLACKLIST,
      blackList
        .reduce(
          (style: string, user: User) =>
            style + ` .js-comment[data-user-id="${user.id}"] {display: none;}`,
          ""
        )
        .trim()
    );
  };

  private createHighlightBlockedStyles = (blackList: Users) => {
    this.styleMap.set(
      StyleRule.HIGHLIGHT_BLOCKED,
      blackList
        .reduce(
          (style: string, user: User) =>
            style +
            ` .js-comment[data-user-id="${user.id}"] {border: 2px solid red;}`,
          ""
        )
        .trim()
    );
  };

  private createHighlightFavouriteStyles = (whiteList: Users) => {
    this.styleMap.set(
      StyleRule.HIGHLIGHT_FAVOURITE,
      whiteList
        .reduce(
          (style: string, user: User) =>
            style +
            ` .js-comment[data-user-id="${user.id}"] {border: 2px solid blue;}`,
          ""
        )
        .trim()
    );
  };

  private createWhiteListStyles = (whiteList: Users) => {
    this.styleMap.set(
      StyleRule.WHITELIST,
      whiteList.length > 0
        ? whiteList
            .reduce(
              (style: string, user: User) =>
                style +
                ` .js-comment[data-user-id="${user.id}"] {display: block;}`,
              ".js-comment {display: none;}"
            )
            .trim()
        : ""
    );
  };

  updateBlackList = (blackList: Users, genState: GeneralStoreState): string => {
    this.createBlackListStyles(blackList);
    this.createHighlightBlockedStyles(blackList);
    this.updateStyleRules(genState);
    return this.styleRules;
  };

  updateWhiteList = (whiteList: Users, genState: GeneralStoreState): string => {
    this.createWhiteListStyles(whiteList);
    this.createHighlightFavouriteStyles(whiteList);
    this.updateStyleRules(genState);
    return this.styleRules;
  };

  updateStyles = (
    genState: GeneralStoreState,
    blackList: Users,
    whiteList: Users
  ): string => {
    this.createBlackListStyles(blackList);
    this.createWhiteListStyles(whiteList);
    this.createHighlightBlockedStyles(blackList);
    this.createHighlightFavouriteStyles(whiteList);
    this.updateStyleRules(genState);
    return this.styleRules;
  };

  getStyleRules = (): string => this.styleRules;
}
