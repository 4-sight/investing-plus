import { EventMessage } from "../../types";
import {
  linkToContentScript,
  toggleEnabled,
  toggleHighlightBlocked,
  toggleHighlightFavourite,
  switchBlocking,
  addToBlackList,
  addToWhiteList,
} from "../eventPage";
import { GeneralStore } from "../Classes";

const {
  CONTENT_SCRIPT_MOUNTED,
  POPUP_MOUNTED,
  TOGGLE_ENABLED,
  TOGGLE_HIGHLIGHT_BLOCKED,
  TOGGLE_HIGHLIGHT_FAVOURITE,
  SWITCH_BLOCKING,
  BLACKLIST_ADD,
  WHITELIST_ADD,
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
      case CONTENT_SCRIPT_MOUNTED:
        linkToContentScript(sender.tab);
        break;

      case POPUP_MOUNTED:
        sendResponse(genStore.getState());
        break;

      case TOGGLE_ENABLED:
        toggleEnabled();
        break;

      case TOGGLE_HIGHLIGHT_BLOCKED:
        toggleHighlightBlocked();
        break;

      case TOGGLE_HIGHLIGHT_FAVOURITE:
        toggleHighlightFavourite();
        break;

      case SWITCH_BLOCKING:
        switchBlocking();
        break;

      case BLACKLIST_ADD:
        addToBlackList(req.payload);
        break;

      case WHITELIST_ADD:
        addToWhiteList(req.payload);
        break;

      default:
        break;
    }
  }

  return responseIsAsync;
};
