import { EventMessage, Message, StoreState } from "../types";

export class Store {
  private storeState: StoreState;

  constructor(state: StoreState) {
    this.storeState = { ...state };
    chrome.storage.sync.get(["store"], (res) => {
      if ("store" in res) {
        this.storeState = { ...state, ...res.store };
      } else {
        chrome.storage.sync.set({ store: this.storeState });
      }
    });

    chrome.storage.onChanged.addListener(this.syncListener);
    chrome.runtime.onMessage.addListener(this.messageListener);
  }

  public getStore() {
    return this.storeState;
  }

  public setStore(newState: StoreState) {
    this.storeState = newState;
    this.publish();
    this.updateSyncStore();
  }

  public get(key: keyof StoreState) {
    return this.storeState[key];
  }

  public set(key: keyof StoreState, val: any) {
    this.storeState[key] = val;
    this.publish();
    this.updateSyncStore();
  }

  private postMessage({ type, payload }: Message) {
    chrome.runtime.sendMessage({ type, payload });
  }

  private publish() {
    this.postMessage({
      type: EventMessage.STORE_UPDATED,
      payload: this.storeState,
    });
  }

  private updateSyncStore() {
    chrome.storage.sync.set({ store: this.storeState });
  }

  private syncListener = (changes) => {
    if ("store" in changes) {
      this.storeState = changes.store.newValue;
      this.publish();
    }
  };

  private messageListener = (req, sender, sendResponse) => {
    if (typeof req === "object" && "type" in req) {
      if ("payload" in req) {
        switch (req.type) {
          case EventMessage.STORE_GET:
            sendResponse(this.get(req.payload));
            break;

          case EventMessage.STORE_OVERRIDE:
            this.setStore(req.payload);
            break;

          case EventMessage.STORE_SET:
            this.set(req.payload.key, req.payload.val);
            break;

          default:
            break;
        }
      } else {
        switch (req.type) {
          case EventMessage.STORE_GET_STORE:
            sendResponse(this.getStore());
            break;

          default:
            break;
        }
      }
    }
  };
}
