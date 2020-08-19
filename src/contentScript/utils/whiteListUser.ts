import { EventMessage } from "../../types";

export const whiteListUser = (userName: string, userId: string) => (
  e: MouseEvent
) => {
  e.preventDefault();
  chrome.runtime.sendMessage({
    type: EventMessage.WHITELIST_ADD,
    payload: { name: userName, id: userId },
  });
};
