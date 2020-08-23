import { StyleMap, GeneralStoreState, Users, StyleRule } from "../../types";
import {
  generateRules,
  blackListStyles,
  whiteListStyles,
  highlightBlockedStyles,
  highlightFavouriteStyles,
  handleBlackListButtonStyles,
  handleWhiteListButtonStyles,
} from "../styles";

export class Styles {
  private styleMap: StyleMap = new Map();
  private styleRules: string = "";

  constructor(genState: GeneralStoreState, blackList: Users, whiteList: Users) {
    this.handleBlackListButtons(blackList);
    this.handleWhiteListButtons(whiteList);
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

  private handleBlackListButtons = (blackList: Users) => {
    this.styleMap.set(
      StyleRule.BLACKLIST_USER_BUTTONS,
      handleBlackListButtonStyles(blackList)
    );
  };

  private handleWhiteListButtons = (whiteList: Users) => {
    this.styleMap.set(
      StyleRule.WHITELIST_USER_BUTTONS,
      handleWhiteListButtonStyles(whiteList)
    );
  };

  updateBlackList = (blackList: Users, genState: GeneralStoreState): string => {
    this.handleBlackListButtons(blackList);
    this.createBlackListStyles(blackList);
    this.createHighlightBlockedStyles(blackList);
    this.updateStyleRules(genState);
    return this.styleRules;
  };

  updateWhiteList = (whiteList: Users, genState: GeneralStoreState): string => {
    this.handleWhiteListButtons(whiteList);
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
    this.handleBlackListButtons(blackList);
    this.handleWhiteListButtons(whiteList);
    this.createBlackListStyles(blackList);
    this.createWhiteListStyles(whiteList);
    this.createHighlightBlockedStyles(blackList);
    this.createHighlightFavouriteStyles(whiteList);
    this.updateStyleRules(genState);
    return this.styleRules;
  };

  getStyleRules = (): string => this.styleRules;
}
