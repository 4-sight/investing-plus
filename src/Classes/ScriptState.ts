import { StoreState, Blocking } from "../types";
import { UserStore } from "./UserStore";

export class ScriptState {
  enabled: boolean;
  blocking: Blocking;
  blackList: UserStore;
  whiteList: UserStore;

  constructor(store: StoreState) {
    this.enabled = store.enabled;
    this.blocking = store.blocking;
    this.blackList = new UserStore(store.blackList.list());
    this.whiteList = new UserStore(store.whiteList.list());
  }
}
