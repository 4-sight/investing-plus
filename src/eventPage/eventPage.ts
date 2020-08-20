import {
  PortHandler,
  PortHandlerStore,
  GeneralStore,
  UsersStore,
  Styles,
} from "./Classes";
import { defaultStores } from "../constants";
import { runtimeListener, syncListener } from "./listeners";
import {
  EventMessage,
  Blocking,
  User,
  UpdatePorts,
  StoreName,
  GeneralStoreState,
  Users,
} from "../types";

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

export const updateChromeStorage = (store: StoreName) => {
  switch (store) {
    case "genStore":
      chrome.storage.sync.set({ generalStore: generalStore.getState() });
      break;

    case "blackList":
      chrome.storage.sync.set({ blackList: blackList.getUsers() });
      break;

    case "whiteList":
      chrome.storage.sync.set({ whiteList: whiteList.getUsers() });
      break;
  }
};

export const updateStyles = () => {
  styles.updateStyles(
    generalStore.getState(),
    blackList.getUsers(),
    whiteList.getUsers()
  );
};

export const updatePorts: UpdatePorts = (options) => {
  const { sync, stylesUpdate } = options;

  if (sync) {
    updateChromeStorage(sync);
  }

  switch (stylesUpdate) {
    case "all":
      updateStyles();
      break;

    case "blackList":
      styles.updateBlackList(blackList.getUsers(), generalStore.getState());
      break;

    case "whiteList":
      styles.updateWhiteList(whiteList.getUsers(), generalStore.getState());
      break;
  }

  portHandlers.updatePorts(styles.getStyleRules());
};

export const syncChromeStorage = () => {
  chrome.storage.sync.get(["generalStore", "blackList", "whiteList"], (res) => {
    let set = false;
    const outbound: {
      generalStore?: GeneralStoreState;
      blackList?: Users;
      whiteList?: Users;
    } = {};

    if ("generalStore" in res) {
      generalStore.setState(res.generalStore);
      updatePorts({ stylesUpdate: "all" });
    } else {
      outbound.generalStore = generalStore.getState();
      set = true;
    }

    if ("blackList" in res) {
      if (blackList.updateList(res.blackList)) {
        updatePorts({ stylesUpdate: "blackList" });
      } else {
        outbound.blackList = blackList.getUsers();
        set = true;
      }
    } else {
      outbound.blackList = blackList.getUsers();
      set = true;
    }

    if ("whiteList" in res) {
      if (whiteList.updateList(res.whiteList)) {
        updatePorts({ stylesUpdate: "whiteList" });
      } else {
        outbound.whiteList = whiteList.getUsers();
        set = true;
      }
    } else {
      outbound.whiteList = whiteList.getUsers();
      set = true;
    }

    if (set) {
      chrome.storage.sync.set(outbound);
    }
  });
};

//===============================================
//Actions========================================

export const linkToContentScript = (tab: chrome.tabs.Tab) => {
  console.log("LINK, styles: ", styles.getStyleRules());
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

  updateChromeStorage("genStore");

  generalStore.get("enabled")
    ? portHandlers.enablePorts()
    : portHandlers.disablePorts();
};

export const toggleHighlightBlocked = () => {
  generalStore.set({ highlightBlocked: !generalStore.get("highlightBlocked") });

  sendRuntimeMessage({
    type: EventMessage.GEN_STORE_UPDATED,
    payload: generalStore.getState(),
  });

  updatePorts({ sync: "genStore", stylesUpdate: "all" });
};

export const toggleHighlightFavourite = () => {
  generalStore.set({
    highlightFavourite: !generalStore.get("highlightFavourite"),
  });

  sendRuntimeMessage({
    type: EventMessage.GEN_STORE_UPDATED,
    payload: generalStore.getState(),
  });

  updatePorts({ sync: "genStore", stylesUpdate: "all" });
};

export const switchBlocking = () => {
  const blockingOptions = Object.keys(Blocking).length / 2;
  generalStore.set({
    blocking:
      (generalStore.get("blocking") + (blockingOptions + 1)) % blockingOptions,
  });

  sendRuntimeMessage({
    type: EventMessage.GEN_STORE_UPDATED,
    payload: generalStore.getState(),
  });

  updatePorts({ sync: "genStore", stylesUpdate: "all" });
};

export const addToBlackList = (user: User) => {
  if (blackList.createUser(user)) {
    updatePorts({ sync: "blackList", stylesUpdate: "blackList" });
  }
};

export const removeFromBlackList = (user: User) => {
  if (blackList.deleteUser(user.id)) {
    updatePorts({ sync: "blackList", stylesUpdate: "blackList" });
  }
};

export const addToWhiteList = (user: User) => {
  if (whiteList.createUser(user)) {
    updatePorts({ stylesUpdate: "whiteList", sync: "whiteList" });
  }
};

export const removeFromWhiteList = (user: User) => {
  if (whiteList.deleteUser(user.id)) {
    updatePorts({ stylesUpdate: "whiteList", sync: "whiteList" });
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

//=================================================

export const initializeEventPage = () => {
  addRuntimeListener();
  addStorageListener();
  syncChromeStorage();
};
