import {
  ScriptCommand,
  StoreState,
  ScriptUpdate,
  ScriptBatchUpdate,
} from "../types";
import { ScriptState } from "./ScriptState";

export class PortHandler {
  private port: chrome.runtime.Port;
  private removePort: () => void;

  constructor(tab: chrome.tabs.Tab, removePort: () => void) {
    this.port = chrome.tabs.connect(tab.id);
    this.removePort = removePort;

    this.port.onDisconnect.addListener(this.onDisconnect);
    this.port.onMessage.addListener(this.portListener);
  }

  private onDisconnect = () => {
    this.port.onMessage.removeListener(this.portListener);
    this.removePort();
  };

  private portListener = () => {
    //TODO port listener
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

  public update = (update: ScriptUpdate) => {
    this.port.postMessage({
      type: ScriptCommand.UPDATE,
      payload: update,
    });
  };

  public batchUpdate = (updates: ScriptBatchUpdate) => {
    this.port.postMessage({
      type: ScriptCommand.UPDATE_BATCH,
      payload: updates,
    });
  };
}
