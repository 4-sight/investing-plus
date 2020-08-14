import {
  PortHandler,
  PortHandlerStore,
  GeneralStore,
  UsersStore,
  Styles,
} from "./Classes";
import { defaultStores } from "../constants";
import {
  runtimeListener,
  syncListener,
  contextMenuListener,
} from "./listeners";
import { EventMessage, Blocking, User } from "../types";

export const generalStore = new GeneralStore(defaultStores.generalStore());
export const blackList = new UsersStore("blackList");
export const whiteList = new UsersStore("whiteList");
export const styles = new Styles(
  generalStore.getState(),
  blackList.getUsers(),
  whiteList.getUsers()
);
export const portHandlers = new PortHandlerStore();

//============================================

export const sendRuntimeMessage = (message: {
  type: EventMessage;
  payload?: any;
}) => {
  chrome.runtime.sendMessage(message);
};

export const syncGenStore = () => {
  chrome.storage.sync.set({ generalStore: generalStore.getState() });
};

export const syncBlackList = () => {
  chrome.storage.sync.set({ blackList: blackList.getUsers() });
};

export const syncWhiteList = () => {
  chrome.storage.sync.set({ whiteList: whiteList.getUsers() });
};

export const updateStyles = () => {
  styles.updateStyles(
    generalStore.getState(),
    blackList.getUsers(),
    whiteList.getUsers()
  );
};

//===============================================
//Actions========================================

export const linkToContentScript = (tab: chrome.tabs.Tab) => {
  const portHandler = new PortHandler(tab, portHandlers.removePort(tab.id));
  portHandler.initialize(styles.getStyleRules(), generalStore.get("enabled"));
  portHandlers.addPort(tab.id, portHandler);
};

export const toggleEnabled = () => {
  generalStore.set({ enabled: !generalStore.get("enabled") });

  sendRuntimeMessage({
    type: EventMessage.GEN_STORE_UPDATED,
    payload: generalStore.getState(),
  });

  syncGenStore();

  generalStore.get("enabled")
    ? portHandlers.enablePorts()
    : portHandlers.disablePorts();
};

export const switchBlocking = () => {
  generalStore.set({
    blocking:
      (generalStore.get("blocking") + Object.keys(Blocking).length / 2 + 1) % 3,
  });

  sendRuntimeMessage({
    type: EventMessage.GEN_STORE_UPDATED,
    payload: generalStore.getState(),
  });

  syncGenStore();
  updateStyles();
  portHandlers.updatePorts(styles.getStyleRules());
};

export const addToBlackList = (user: User) => {
  if (blackList.createUser(user)) {
    styles.updateBlackList(blackList.getUsers(), generalStore.getState());
    syncBlackList();
    portHandlers.updatePorts(styles.getStyleRules());
  }
};

export const addToWhiteList = (user: User) => {
  if (whiteList.createUser(user)) {
    styles.updateWhiteList(whiteList.getUsers(), generalStore.getState());
    syncWhiteList();
    portHandlers.updatePorts(styles.getStyleRules());
  }
};

//============================================
// Add listeners

export const addRuntimeListener = () => {
  chrome.runtime.onMessage.addListener(runtimeListener(generalStore));
};

export const addStorageListener = () => {
  chrome.storage.onChanged.addListener(
    syncListener(generalStore, blackList, whiteList, styles, portHandlers)
  );
};

export const addContextMenuListener = () => {
  chrome.contextMenus.onClicked.addListener(
    contextMenuListener(addToBlackList, addToWhiteList)
  );
};

export const createContextMenuItems = () => {
  chrome.contextMenus.create({
    id: "add-to-blackList",
    title: "Block User",
    contexts: ["all"],
  });

  chrome.contextMenus.create({
    id: "add-to-whiteList",
    title: "Favourite User",
    contexts: ["all"],
  });
};

//=================================================

export const initializeEventPage = () => {
  addRuntimeListener();
  addStorageListener();
  createContextMenuItems();
  addContextMenuListener();
};
