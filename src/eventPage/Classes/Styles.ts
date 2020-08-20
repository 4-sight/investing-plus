import {
  StyleMap,
  GeneralStoreState,
  Users,
  User,
  StyleRule,
} from "../../types";
import {
  generateRules,
  blackListStyles,
  whiteListStyles,
  highlightBlockedStyles,
  highlightFavouriteStyles,
} from "../styles";

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
    this.styleMap.set(StyleRule.BLACKLIST, blackListStyles(blackList));
  };

  private createHighlightBlockedStyles = (blackList: Users) => {
    this.styleMap.set(
      StyleRule.HIGHLIGHT_BLOCKED,
      highlightBlockedStyles(blackList)
    );
  };

  private createHighlightFavouriteStyles = (whiteList: Users) => {
    this.styleMap.set(
      StyleRule.HIGHLIGHT_FAVOURITE,
      highlightFavouriteStyles(whiteList)
    );
  };

  private createWhiteListStyles = (whiteList: Users) => {
    this.styleMap.set(StyleRule.WHITELIST, whiteListStyles(whiteList));
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
