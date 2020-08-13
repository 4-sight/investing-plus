import { PortHandlerStore, GeneralStore, UsersStore, Styles } from "./Classes";
import { defaultStores } from "../constants";
import { runtimeListener, syncListener } from "./listeners";

const generalStore = new GeneralStore(defaultStores.generalStore());
const blackList = new UsersStore("blackList");
const whiteList = new UsersStore("whiteList");
const styles = new Styles(
  generalStore.getState(),
  blackList.getUsers(),
  whiteList.getUsers()
);
const portHandlers = new PortHandlerStore();

chrome.runtime.onMessage.addListener(
  runtimeListener(generalStore, blackList, whiteList, styles, portHandlers)
);
chrome.storage.onChanged.addListener(
  syncListener(generalStore, blackList, whiteList, styles, portHandlers)
);

// context menus
// chrome.contextMenus.create({
//   id: "add-to-blackList",
//   title: "Block User",
//   contexts: ["all"],
// });
