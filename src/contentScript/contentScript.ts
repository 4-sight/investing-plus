import { portListener } from "./listeners";
import { EventMessage } from "../types";

export default () => {
  const styleSheet = document.createElement("style");
  chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener(portListener(styleSheet));
  });
  chrome.runtime.sendMessage({ type: EventMessage.CONTENT_SCRIPT_MOUNTED });
};
