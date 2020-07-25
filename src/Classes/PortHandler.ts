import { ScriptCommand, StoreState, ScriptStateChanges } from "../types";
import { ScriptState } from "./ScriptState";

export class PortHandler {
  private port: chrome.runtime.Port;
  private removePort: () => void;
  blocking: {
    enable: () => void;
    disable: () => void;
  };

  constructor(tab: chrome.tabs.Tab, removePort: () => void) {
    this.port = chrome.tabs.connect(tab.id);
    this.removePort = removePort;

    this.port.onDisconnect.addListener(this.onDisconnect);
    this.port.onMessage.addListener(this.portListener);
    this.blocking = {
      enable: this.enableBlocking,
      disable: this.disableBlocking,
    };
  }

  private onDisconnect = () => {
    this.port.onMessage.removeListener(this.portListener);
    this.removePort();
  };

  private portListener = () => {
    //TODO port listener
  };

  private enableBlocking = () => {
    this.port.postMessage({
      type: ScriptCommand.BLOCKING_ENABLE,
    });
  };

  private disableBlocking = () => {
    this.port.postMessage({
      type: ScriptCommand.BLOCKING_DISABLE,
    });
  };

  public initialize = (store: StoreState) => {
    this.port.postMessage({
      type: ScriptCommand.INITIALIZE,
      payload: new ScriptState(store),
    });
  };

  public enable = () => {
    this.port.postMessage({
      type: ScriptCommand.ENABLE,
    });
  };

  public disable = () => {
    this.port.postMessage({
      type: ScriptCommand.DISABLE,
    });
  };

  public batchUpdate = (updates: ScriptStateChanges) => {
    this.port.postMessage({
      type: ScriptCommand.UPDATE_BATCH,
      payload: updates,
    });
  };
}
