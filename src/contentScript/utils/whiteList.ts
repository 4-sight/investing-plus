import { EventMessage } from "../../types";

export const whiteListAdd = (userName: string, userId: string) => (
  e: MouseEvent
) => {
  e.preventDefault();
  chrome.runtime.sendMessage({
    type: EventMessage.WHITELIST_ADD,
    payload: { name: userName, id: userId },
  });
};

export const whiteListRemove = (userName: string, userId: string) => (
  e: MouseEvent
) => {
  e.preventDefault();
  chrome.runtime.sendMessage({
    type: EventMessage.WHITELIST_REMOVE,
    payload: { name: userName, id: userId },
  });
};
