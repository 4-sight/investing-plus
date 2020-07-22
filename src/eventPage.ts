import { EventMessage, StoreState } from "./types";
import { Store } from "./Classes";

export class EventHandler {
  private store: Store;
  constructor(state: StoreState) {
    this.store = new Store(state);
  }
}
