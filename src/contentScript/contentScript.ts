import { portListener } from "./listeners";
import { EventMessage } from "../types";
import initialStyles from "./initialStyles";

export default () => {
  const defaultStyles = document.createElement("style");
  defaultStyles.innerHTML = initialStyles as string;
  document.body.appendChild(defaultStyles);
  const styleSheet = document.createElement("style");
  chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener(portListener(styleSheet));
  });
  chrome.runtime.sendMessage({ type: EventMessage.CONTENT_SCRIPT_MOUNTED });
};
