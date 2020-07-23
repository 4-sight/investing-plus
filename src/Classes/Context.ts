import { StyleMap, User } from "../types";
import { ScriptStateStore } from "./ScriptStateStore";
import { ScriptState } from "./ScriptState";
import { userBlocking } from "../styleActions";

export class Context {
  private sheet: HTMLStyleElement;
  private styles: StyleMap;
  private store: ScriptStateStore;
  blocking: {
    enable: () => void;
    disable: () => void;
  };

  constructor() {
    this.sheet = document.createElement("style");
    this.styles = new Map();
    this.store;
    this.blocking = {
      enable: this.enableBlocking,
      disable: this.disableBlocking,
    };
  }

  // Private methods ====================================

  private createStylesRules = () => {
    this.store.get("blocking") && this.blockUsers();
  };

  private insertPageStyles = () => {
    this.sheet.innerHTML = Array.from(this.styles.values()).join(" ");
  };

  private addStylesToDocument = () => {
    document.body.appendChild(this.sheet);
  };

  private removeStylesFromDocument = () => {
    document.body.removeChild(this.sheet);
  };

  private updatePageStyles = () => {
    this.insertPageStyles();
    this.addStylesToDocument();
  };

  private blockUsers = () => {
    const blackListIds = this.store
      .get("blackList")
      ?.map((user: User) => user.id);

    blackListIds && userBlocking.enable(this.styles, blackListIds);
  };

  private unblockUsers = () => {
    userBlocking.disable(this.styles);
  };

  // Public Methods =======================================

  enable = () => {
    this.addStylesToDocument();
  };

  disable = () => {
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

  enableBlocking = () => {
    this.store.set("blocking", true);
    this.blockUsers();
    this.updatePageStyles();
  };

  disableBlocking = () => {
    this.store.set("blocking", false);
    this.unblockUsers();
    this.updatePageStyles();
  };
}
