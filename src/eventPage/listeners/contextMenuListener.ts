import { User } from "../../types";

export const contextMenuListener = (
  addToBlackList: (user: User) => void,
  addToWhiteList: (user: User) => void
) => ({
  menuItemId,
  linkUrl,
  selectionText,
}: chrome.contextMenus.OnClickData) => {
  switch (menuItemId) {
    case "add-to-blackList":
      if (linkUrl) {
        addToBlackList({
          name: selectionText || "unknown user",
          id: linkUrl.split("/").pop(),
        });
      }
      break;

    case "add-to-whiteList":
      if (linkUrl) {
        addToWhiteList({
          name: selectionText || "unknown user",
          id: linkUrl.split("/").pop(),
        });
      }
      break;
  }
};
