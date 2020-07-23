import { StoreState, User } from "../types";

export class ScriptState {
  blocking: boolean;
  blackList: User[];
  whiteList: User[];

  constructor(store: StoreState) {
    this.blocking = store.blocking;
    this.blackList = [...store.blackList];
    this.whiteList = [...store.whiteList];
  }
}
