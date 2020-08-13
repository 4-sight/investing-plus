import { EventMessage, Blocking } from "../../types";
import {
  PortHandler,
  GeneralStore,
  UsersStore,
  PortHandlerStore,
  Styles,
} from "../Classes";

const {
  CONTENT_SCRIPT_MOUNTED,
  POPUP_MOUNTED,
  GEN_STORE_UPDATED,
  TOGGLE_ENABLED,
  SWITCH_BLOCKING,
} = EventMessage;

const sendRuntimeMessage = (message: { type: EventMessage; payload?: any }) => {
  chrome.runtime.sendMessage(message);
};
const setSync = (payload: { [x: string]: any }) => {
  chrome.storage.sync.set(payload);
};

export const runtimeListener = (
  genStore: GeneralStore,
  blackList: UsersStore,
  whiteList: UsersStore,
  styles: Styles,
  portHandlerStore: PortHandlerStore
) => (
  req,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
  let responseIsAsync = false;

  if (typeof req === "object" && "type" in req) {
    switch (req.type) {
      // CONTENT_SCRIPT_MOUNTED
      case CONTENT_SCRIPT_MOUNTED:
        const portHandler = new PortHandler(
          sender.tab,
          portHandlerStore.removePort(sender.tab.id)
        );

        portHandler.initialize(styles.getStyleRules(), genStore.get("enabled"));

        portHandlerStore.addPort(sender.tab.id, portHandler);
        break;

      case POPUP_MOUNTED:
        sendResponse(genStore.getState());
        break;

      // TOGGLE_ENABLED
      case TOGGLE_ENABLED:
        genStore.set({ enabled: !genStore.get("enabled") });

        sendRuntimeMessage({
          type: GEN_STORE_UPDATED,
          payload: genStore.getState(),
        });

        setSync(genStore.getState());

        genStore.get("enabled")
          ? portHandlerStore.enablePorts()
          : portHandlerStore.disablePorts();
        break;

      // SWITCH_BLOCKING
      case SWITCH_BLOCKING:
        genStore.set({
          blocking:
            (genStore.get("blocking") + Object.keys(Blocking).length / 2 + 1) %
            3,
        });

        sendRuntimeMessage({
          type: GEN_STORE_UPDATED,
          payload: genStore.getState(),
        });

        setSync(genStore.getState());

        styles.updateStyles(
          genStore.getState(),
          blackList.getUsers(),
          whiteList.getUsers()
        );

        portHandlerStore.updatePorts(styles.getStyleRules());
        break;

      default:
        break;
    }
  }

  return responseIsAsync;
};
