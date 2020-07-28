import { StoreState, User, Blocking } from "../types";

export class ScriptState {
  enabled: boolean;
  blocking: Blocking;
  blackList: User[];
  whiteList: User[];

  constructor(store: StoreState) {
    this.enabled = store.enabled;
    this.blocking = store.blocking;
    this.blackList = [...store.blackList];
    this.whiteList = [...store.whiteList];
  }
}
