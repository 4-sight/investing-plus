import { StoreState, User } from "../types";

export class ScriptState {
  enabled: boolean;
  blocking: boolean;
  blackList: User[];
  whiteList: User[];

  constructor(store: StoreState) {
    this.enabled = store.enabled;
    this.blocking = store.blocking;
    this.blackList = [...store.blackList];
    this.whiteList = [...store.whiteList];
  }
}
