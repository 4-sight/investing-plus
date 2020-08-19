import React, { useState, useEffect } from "react";
import { GeneralStoreState, EventMessage } from "../../types";
import { defaultStores } from "../../constants";
import eventListener from "../listeners/eventListener";

export type SetGenStore = React.Dispatch<
  React.SetStateAction<GeneralStoreState>
>;
type Listener = (req: any) => boolean;
type Actions = {
  toggleEnabled: () => void;
  toggleHighlightBlocked: () => void;
  toggleHighlightFavourite: () => void;
  switchBlocking: () => void;
};

const connect = (setStore: SetGenStore, listener: Listener) => {
  chrome.runtime.sendMessage(
    { type: EventMessage.POPUP_MOUNTED },
    (storeState: GeneralStoreState) => {
      setStore(storeState);
    }
  );

  chrome.runtime.onMessage.addListener(listener);
};

const disconnect = (listener: Listener) => {
  chrome.runtime.onMessage.removeListener(listener);
};

//==================================================================

export default function useGenStore(): [GeneralStoreState, Actions] {
  const [genStore, setStore] = useState<GeneralStoreState>(
    defaultStores.generalStore()
  );

  useEffect(() => {
    const listener = eventListener(setStore);
    connect(setStore, listener);

    return () => {
      disconnect(listener);
    };
  }, []);

  const toggleEnabled = () => {
    chrome.runtime.sendMessage({ type: EventMessage.TOGGLE_ENABLED });
  };

  const toggleHighlightBlocked = () => {
    chrome.runtime.sendMessage({ type: EventMessage.TOGGLE_HIGHLIGHT_BLOCKED });
  };

  const toggleHighlightFavourite = () => {
    chrome.runtime.sendMessage({
      type: EventMessage.TOGGLE_HIGHLIGHT_FAVOURITE,
    });
  };

  const switchBlocking = () => {
    chrome.runtime.sendMessage({ type: EventMessage.SWITCH_BLOCKING });
  };

  const actions = {
    toggleEnabled,
    toggleHighlightBlocked,
    toggleHighlightFavourite,
    switchBlocking,
  };

  return [genStore, actions];
}
