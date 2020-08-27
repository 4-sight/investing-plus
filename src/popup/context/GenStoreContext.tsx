import React, { useContext, useState, useEffect } from "react";
import { GeneralStoreState, Blocking, EventMessage } from "../../types";
import { defaultStores } from "../../constants";
import { genStoreListener } from "../listeners/eventListener";
import { BlockingMode } from "../Components/pages/Dashboard";

export type SetGenStore = React.Dispatch<
  React.SetStateAction<GeneralStoreState>
>;
type Listener = (req: any) => boolean;
export type Actions = {
  toggleEnabled: () => void;
  toggleHighlightBlocked: () => void;
  toggleHighlightFavourite: () => void;
  setBlocking: (blocking: BlockingMode) => void;
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

//===========================================================

const GenStoreStateContext = React.createContext<GeneralStoreState>(
  defaultStores.generalStore()
);
const GenStoreActionsContext = React.createContext<Actions>({} as Actions);

//=============================================================

export const GenStoreStateProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [genStore, setStore] = useState<GeneralStoreState>(
    defaultStores.generalStore()
  );

  useEffect(() => {
    const listener = genStoreListener(setStore);
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

  const setBlocking = (blockingOption: BlockingMode) => {
    let payload;
    switch (blockingOption) {
      case "Off":
        payload = Blocking.NONE;
        break;

      case "Hide Blocked":
        payload = Blocking.BLACKLIST;
        break;

      case "Show Only Favourite":
        payload = Blocking.WHITELIST;
        break;
    }
    chrome.runtime.sendMessage({ type: EventMessage.SET_BLOCKING, payload });
  };

  const actions = {
    toggleEnabled,
    toggleHighlightBlocked,
    toggleHighlightFavourite,
    setBlocking,
  };

  return (
    <GenStoreStateContext.Provider value={genStore}>
      <GenStoreActionsContext.Provider value={actions}>
        {children}
      </GenStoreActionsContext.Provider>
    </GenStoreStateContext.Provider>
  );
};

export const useGenStoreState = (): GeneralStoreState =>
  useContext(GenStoreStateContext);
export const useGenStoreActions = (): Actions =>
  useContext(GenStoreActionsContext);
