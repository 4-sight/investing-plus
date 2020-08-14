import { EventMessage } from "../../types";
import {
  linkToContentScript,
  toggleEnabled,
  switchBlocking,
} from "../eventPage";
import { GeneralStore } from "../Classes";

const {
  CONTENT_SCRIPT_MOUNTED,
  POPUP_MOUNTED,
  TOGGLE_ENABLED,
  SWITCH_BLOCKING,
} = EventMessage;

export const sendRuntimeMessage = (message: {
  type: EventMessage;
  payload?: any;
}) => {
  chrome.runtime.sendMessage(message);
};
export const setSync = (payload: { [x: string]: any }) => {
  chrome.storage.sync.set(payload);
};

export const runtimeListener = (genStore: GeneralStore) => (
  req,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
  let responseIsAsync = false;

  if (typeof req === "object" && "type" in req) {
    switch (req.type) {
      // CONTENT_SCRIPT_MOUNTED
      case CONTENT_SCRIPT_MOUNTED:
        linkToContentScript(sender.tab);
        break;

      case POPUP_MOUNTED:
        sendResponse(genStore.getState());
        break;

      // TOGGLE_ENABLED
      case TOGGLE_ENABLED:
        toggleEnabled();
        break;

      // SWITCH_BLOCKING
      case SWITCH_BLOCKING:
        switchBlocking();
        break;

      default:
        break;
    }
  }

  return responseIsAsync;
};
