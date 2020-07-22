import { StoreState } from "../types";

export class ScriptState {
  blocking: boolean;

  constructor(store: StoreState) {
    this.blocking = store.blocking;
  }
}
