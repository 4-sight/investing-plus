import { EventMessage } from "../../types";

export const blackListUser = (userName: string, userId: string) => (
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
