import { StyleMap, User, Blocking } from "../types";
import { ScriptStateStore } from "./ScriptStateStore";
import { ScriptState } from "./ScriptState";
import { blackList, whiteList } from "../styleActions";

export class Context {
  private sheet: HTMLStyleElement;
  private styles: StyleMap;
  private store: ScriptStateStore;

  constructor() {
    this.sheet = document.createElement("style");
    this.styles = new Map();
    this.store;
  }

  // Private methods ====================================

  private createStylesRules = () => {
    this.handleBlocking(this.store.get("blocking"));
  };

  private insertPageStyles = () => {
    this.sheet.innerHTML = Array.from(this.styles.values()).join(" ");
  };

  private addStylesToDocument = () => {
    if (this.store.get("enabled")) {
      document.body.appendChild(this.sheet);
    }
  };

  private removeStylesFromDocument = () => {
    document.body.removeChild(this.sheet);
  };

  private updatePageStyles = () => {
    this.insertPageStyles();
    this.addStylesToDocument();
  };

  private addBlackList = () => {
    const blackListIds = this.store
      .get("blackList")
      ?.map((user: User) => user.id);

    blackListIds && blackList.enable(this.styles, blackListIds);
  };

  private removeBlackList = () => {
    blackList.disable(this.styles);
  };

  private addWhiteList = () => {
    const whiteListIds = this.store
      .get("whiteList")
      ?.map((user: User) => user.id);

    whiteListIds && whiteList.enable(this.styles, whiteListIds);
  };

  private removeWhiteList = () => {
    whiteList.disable(this.styles);
  };

  private handleBlocking = (mode: Blocking) => {
    switch (mode) {
      case Blocking.BLACKLIST:
        this.store.set("blocking", Blocking.BLACKLIST);
        this.removeWhiteList();
        this.addBlackList();
        break;

      case Blocking.WHITELIST:
        this.store.set("blocking", Blocking.WHITELIST);
        this.removeBlackList();
        this.addWhiteList();
        break;

      case Blocking.NONE:
        this.store.set("blocking", Blocking.NONE);
        this.removeBlackList();
        this.removeWhiteList();
        break;
    }
  };

  // Public Methods =======================================

  enable = () => {
    this.store.set("enabled", true);
    this.addStylesToDocument();
  };

  disable = () => {
    this.store.set("enabled", false);
    this.removeStylesFromDocument();
  };

  initializeStyles = (state: ScriptState) => {
    this.store = new ScriptStateStore(state);
    this.createStylesRules();
    this.insertPageStyles();
    this.addStylesToDocument();
  };

  batchUpdateStyles = (newState: ScriptState) => {
    this.store.overrideState(newState);
    this.styles.clear();
    this.createStylesRules();
    this.updatePageStyles();
  };

  setBlocking = (mode: Blocking) => {
    this.handleBlocking(mode);
    this.updatePageStyles();
  };
}
