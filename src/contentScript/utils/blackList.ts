import { EventMessage } from "../../types";

export const blackListAdd = (userName: string, userId: string) => (
  e: MouseEvent
) => {
  e.preventDefault();
  chrome.runtime.sendMessage({
    type: EventMessage.BLACKLIST_ADD,
    payload: {
      name: userName,
      id: userId,
    },
  });
};

export const blackListRemove = (userName: string, userId: string) => (
  e: MouseEvent
) => {
  e.preventDefault();
  chrome.runtime.sendMessage({
    type: EventMessage.BLACKLIST_REMOVE,
    payload: {
      name: userName,
      id: userId,
    },
  });
};
