import { EventMessage } from "../../types";
import {
  linkToContentScript,
  toggleEnabled,
  toggleHighlightBlocked,
  toggleHighlightFavourite,
  switchBlocking,
  addToBlackList,
  removeFromBlackList,
  updateBlackListUser,
  addToWhiteList,
  removeFromWhiteList,
  updateWhiteListUser,
  blackList,
  whiteList,
  generalStore,
  switchBlackListUser,
  switchWhiteListUser,
} from "../eventPage";

const {
  CONTENT_SCRIPT_MOUNTED,
  POPUP_MOUNTED,
  GET_BLACKLIST,
  GET_WHITELIST,
  TOGGLE_ENABLED,
  TOGGLE_HIGHLIGHT_BLOCKED,
  TOGGLE_HIGHLIGHT_FAVOURITE,
  SWITCH_BLOCKING,
  BLACKLIST_ADD,
  BLACKLIST_REMOVE,
  BLACKLIST_UPDATE_USER,
  BLACKLIST_SWITCH_USER,
  WHITELIST_ADD,
  WHITELIST_REMOVE,
  WHITELIST_UPDATE_USER,
  WHITELIST_SWITCH_USER,
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

export const runtimeListener = () => (
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
        sendResponse(generalStore.getState());
        break;

      case GET_BLACKLIST:
        sendResponse(blackList.getUsers());
        break;

      case GET_WHITELIST:
        sendResponse(whiteList.getUsers());
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

      case BLACKLIST_REMOVE:
        removeFromBlackList(req.payload);
        break;

      case BLACKLIST_UPDATE_USER:
        updateBlackListUser(req.payload.user, req.payload.update);
        break;

      case BLACKLIST_SWITCH_USER:
        switchBlackListUser(req.payload);
        break;

      case WHITELIST_ADD:
        addToWhiteList(req.payload);
        break;

      case WHITELIST_REMOVE:
        removeFromWhiteList(req.payload);
        break;

      case WHITELIST_UPDATE_USER:
        updateWhiteListUser(req.payload.user, req.payload.update);
        break;

      case WHITELIST_SWITCH_USER:
        switchWhiteListUser(req.payload);
        break;

      default:
        break;
    }
  }

  return responseIsAsync;
};
