import {
  ScriptCommand,
  StoreState,
  ScriptStateChanges,
  Blocking,
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

  public setBlocking = (mode: Blocking) => {
    this.port.postMessage({
      type: ScriptCommand.BLOCKING_SET,
      payload: mode,
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
