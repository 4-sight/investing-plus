import { StyleMap, GeneralStoreState, Users, User } from "../../types";
import { generateRules } from "../styles";

export class Styles {
  private styleMap: StyleMap = new Map();
  private styleRules: string = "";

  constructor(genState: GeneralStoreState, blackList: Users, whiteList: Users) {
    this.createBlackListStyles(blackList);
    this.createWhiteListStyles(whiteList);
    this.createHighlightStyles(whiteList);
    this.updateStyleRules(genState);
  }

  private updateStyleRules = (genState: GeneralStoreState) => {
    this.styleRules = generateRules(this.styleMap, genState);
  };

  private createBlackListStyles = (blackList: Users) => {
    this.styleMap.set(
      "blackList",
      blackList
        .reduce(
          (style: string, user: User) =>
            style + ` .js-comment[data-user-id="${user.id}"] {display: none;}`,
          ""
        )
        .trim()
    );
  };

  private createHighlightStyles = (whiteList: Users) => {
    this.styleMap.set(
      "highlight",
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
      "whiteList",
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
    this.updateStyleRules(genState);
    return this.styleRules;
  };

  updateWhiteList = (whiteList: Users, genState: GeneralStoreState): string => {
    this.createWhiteListStyles(whiteList);
    this.createHighlightStyles(whiteList);
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
    this.createHighlightStyles(whiteList);
    this.updateStyleRules(genState);
    return this.styleRules;
  };

  getStyleRules = (): string => this.styleRules;
}
