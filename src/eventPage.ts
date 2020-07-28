import { EventMessage, StoreState } from "./types";
import { Store, PortStore, PortHandler } from "./Classes";
import { defaultStore } from "./constants";
import { logger } from "./utils";

export class EventHandler {
  private ports: PortStore;
  private store: Store;
  constructor(state: StoreState, portStore?: PortStore) {
    this.ports = portStore || new PortStore();
    this.store = new Store(state, this.storeUpdateHandler);

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
            port.initialize(this.store.getStore());

            this.ports.addPort(tab.id, port);
          });
          break;

        default:
          break;
      }
    }

    return isResponseAsync;
  };

  private storeUpdateHandler = (scriptChanges) => {
    this.ports.updatePorts(scriptChanges);
  };
}

new EventHandler(defaultStore);
logger("EVENT PAGE");
