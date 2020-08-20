import { GeneralStore, UsersStore, PortHandlerStore, Styles } from "../Classes";

import deepEqual from "deep-equal";
import { EventMessage } from "../../types";

const sendRuntimeMessage = (message: { type: EventMessage; payload?: any }) => {
  chrome.runtime.sendMessage(message);
};

export const syncListener = (
  genStore: GeneralStore,
  blackList: UsersStore,
  whiteList: UsersStore,
  styles: Styles,
  portHandlerStore: PortHandlerStore
) => ({ newValue, oldValue }: chrome.storage.StorageChange) => {
  if (newValue) {
    if ("generalStore" in newValue) {
      // Update store
      if (!deepEqual(genStore.getState(), newValue.generalStore)) {
        const oldStore = genStore.getState();

        genStore.setState(newValue.generalStore);
        // Publish changes
        sendRuntimeMessage({
          type: EventMessage.GEN_STORE_UPDATED,
          payload: genStore.getState(),
        });

        // Non-enabled state changed
        if (
          !deepEqual(
            { ...oldStore, enabled: "blank" },
            { ...newValue.generalStore, enabled: "blank" }
          )
        ) {
          portHandlerStore.updatePorts(
            styles.updateStyles(
              genStore.getState(),
              blackList.getUsers(),
              whiteList.getUsers()
            )
          );
        }

        // Enabled state changed
        if (oldStore.enabled !== newValue.generalStore.enabled) {
          genStore.get("enabled")
            ? portHandlerStore.enablePorts()
            : portHandlerStore.disablePorts();
        }
      }
    }

    if ("blackList" in newValue) {
      // Update blackList
      if (!deepEqual(blackList.getUsers(), newValue.blackList)) {
        blackList.updateList(newValue.blackList);
        //Publish changes
        sendRuntimeMessage({
          type: EventMessage.BLACKLIST_UPDATED,
          payload: blackList.getUsers(),
        });

        // Send updated style rules to ports
        portHandlerStore.updatePorts(
          styles.updateBlackList(blackList.getUsers(), genStore.getState())
        );
      }
    }

    if ("whiteList" in newValue) {
      // Update whiteList
      if (!deepEqual(whiteList.getUsers(), newValue.whiteList)) {
        whiteList.updateList(newValue.whiteList);
        //Publish changes
        sendRuntimeMessage({
          type: EventMessage.WHITELIST_UPDATED,
          payload: whiteList.getUsers(),
        });
        // Send updated style rules to ports
        portHandlerStore.updatePorts(
          styles.updateWhiteList(whiteList.getUsers(), genStore.getState())
        );
      }
    }
  }
};
