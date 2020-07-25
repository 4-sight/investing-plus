import { EventMessage, StoreState } from "./types";
import { Store, PortStore, PortHandler } from "./Classes";
import { defaultStore } from "./constants";

export class EventHandler {
  private ports: PortStore;
  private store: Store;
  constructor(state: StoreState) {
    this.ports = new PortStore();
    this.store = new Store(state);

    chrome.runtime.onMessage.addListener(this.messageListener);
  }

  private messageListener = (req, sender, sendResponse) => {
    let isResponseAsync = false;

    if (typeof req === "object" && "type" in req) {
      switch (req.type) {
        case EventMessage.CONTENT_SCRIPT_MOUNTED:
          chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
            const tab = tabs[0];
            const port = new PortHandler(tab, this.ports.removePort(tab.id));

            this.ports.addPort(tab.id, port);
          });

          break;

        default:
          break;
      }
    }

    return isResponseAsync;
  };
}

new EventHandler(defaultStore);
