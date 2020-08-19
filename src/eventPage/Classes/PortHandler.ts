import { ScriptCommand } from "../../types";

export class PortHandler {
  private port: chrome.runtime.Port;
  private removePort: () => void;

  constructor(tab: chrome.tabs.Tab, removePort: () => void) {
    this.port = chrome.tabs.connect(tab.id);
    this.removePort = removePort;

    this.port.onDisconnect.addListener(this.onDisconnect);
  }

  private onDisconnect = () => {
    this.removePort();
  };

  public initialize = (styles: string, enabled: boolean) => {
    this.port.postMessage({
      type: ScriptCommand.INITIALIZE,
      payload: {
        styles,
        enabled,
      },
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

  public sendStyleRules = (styleRules: string) => {
    this.port.postMessage({
      type: ScriptCommand.NEW_STYLE_RULES,
      payload: styleRules,
    });
  };
}
