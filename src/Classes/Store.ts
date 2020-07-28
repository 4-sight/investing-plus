import { EventMessage, Message, StoreState } from "../types";
import { ScriptState } from "./ScriptState";
import { getScriptChanges } from "../utils";
import deepEqual from "deep-equal";

export class Store {
  private storeState: StoreState;
  private changes: Partial<StoreState>;
  private portUpdate: (changes: [Partial<ScriptState>, number]) => void;

  constructor(
    state: StoreState,
    onUpdate: (changes: [Partial<ScriptState>, number]) => void
  ) {
    this.storeState = { ...state };
    this.changes = {};
    this.portUpdate = onUpdate;
    chrome.storage.sync.get(["store"], (res) => {
      if ("store" in res) {
        this.storeState = { ...state, ...res.store };
      } else {
        chrome.storage.sync.set({ store: { ...this.storeState } });
      }
    });

    chrome.storage.onChanged.addListener(this.syncListener);
    chrome.runtime.onMessage.addListener(this.messageListener);
  }

  public getStore() {
    return { ...this.storeState };
  }

  public setStore(newState: StoreState) {
    this.storeState = { ...newState };
    this.setChanges(newState);
    this.publish();
    this.updateSyncStore();
  }

  public get(key: keyof StoreState) {
    return this.storeState[key];
  }

  public set(payload: Partial<StoreState>) {
    this.storeState = { ...this.storeState, ...payload };
    this.setChanges(payload);
    this.publish();
    this.updateSyncStore();
  }

  public getChanges(): [Partial<StoreState>, number] {
    return [this.changes, Object.keys(this.changes).length];
  }

  private setChanges(stateUpdate: Partial<StoreState>) {
    this.changes = stateUpdate;
  }

  private postMessage({ type, payload }: Message) {
    chrome.runtime.sendMessage({ type, payload });
  }

  private publish() {
    this.postMessage({
      type: EventMessage.STORE_UPDATED,
      payload: { ...this.storeState },
    });
    const scriptChanges = getScriptChanges(this.getChanges()[0]);
    this.portUpdate(scriptChanges);
  }

  private isEqualTo = (newStore: StoreState): boolean => {
    return deepEqual(this.storeState, newStore);
  };

  private updateSyncStore() {
    chrome.storage.sync.set({ store: { ...this.storeState } });
  }

  private syncListener = (changes) => {
    if ("store" in changes) {
      if (!this.isEqualTo(changes.store.newValue)) {
        this.storeState = { ...changes.store.newValue };
        this.publish();
      }
    }
  };

  private messageListener = (req, sender, sendResponse) => {
    let isResponseAsync = false;

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
            this.set(req.payload);
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

    return isResponseAsync;
  };
}
