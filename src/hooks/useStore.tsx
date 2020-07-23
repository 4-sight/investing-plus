import React, { useState, useEffect, useMemo } from "react";
import { StoreState, StoreDispatch, EventMessage } from "../types";
import { isMessage } from "../utils";

type Listener = (req: any) => boolean;
type SetStore = React.Dispatch<React.SetStateAction<StoreState>>;

const connect = (setStore: SetStore, listener: Listener) => {
  chrome.runtime.sendMessage(
    { type: EventMessage.STORE_GET_STORE },
    (store) => {
      setStore(store);
    }
  );

  chrome.runtime.onMessage.addListener(listener);
};

const disconnect = (listener: Listener) => {
  chrome.runtime.onMessage.removeListener(listener);
};

const getListener = (setStore: SetStore) => (req) => {
  let isResponseAsync = false;

  if (isMessage(req) && "payload" in req) {
    if (req.type === EventMessage.STORE_UPDATED) {
      setStore(req.payload);
    }
  }

  return isResponseAsync;
};

const dispatch: StoreDispatch = (payload) => {
  chrome.runtime.sendMessage({ type: EventMessage.STORE_SET, payload });
};

//===============================================================

export default function useStore(): [StoreState, StoreDispatch] {
  const [store, setStore] = useState<StoreState>({} as StoreState);
  const listener = useMemo(() => getListener(setStore), [setStore]);

  useEffect(() => {
    connect(setStore, listener);

    return () => {
      disconnect(listener);
    };
  });

  return [store, dispatch];
}
