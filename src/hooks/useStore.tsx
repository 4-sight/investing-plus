import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  StoreState,
  StoreDispatch,
  EventMessage,
  UseStore,
  Blocking,
  User,
} from "../types";
import { isMessage } from "../utils";
import { defaultStore } from "../constants";
import { UserStore } from "../Classes";

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

export default function useStore(initialStore?: StoreState): UseStore {
  const [store, setStore] = useState<StoreState>(initialStore || defaultStore);
  const listener = useMemo(() => getListener(setStore), [setStore]);

  useEffect(() => {
    connect(setStore, listener);

    return () => {
      disconnect(listener);
    };
  }, []);

  const get = useCallback((key: keyof StoreState) => store[key], [store]);
  const toggleEnabled = useCallback(() => {
    dispatch({ enabled: !store.enabled });
  }, [store]);
  const switchBlocking = useCallback(() => {
    dispatch({
      blocking: (store.blocking + Object.keys(Blocking).length / 2 + 1) % 3,
    });
  }, [store]);

  const blackList = useCallback(() => {
    return store.blackList.list();
  }, [store]);
  const blackListAddUser = useCallback(
    (user: User) => {
      const newList = new UserStore(store.blackList.list());
      newList.add(user);
      dispatch({ blackList: newList });
    },
    [store]
  );
  const blackListRemoveUser = useCallback(
    (userId: string) => {
      const newList = new UserStore(store.blackList.list());
      newList.remove(userId);
      dispatch({ blackList: newList });
    },
    [store]
  );
  const blackListUpdateUser = useCallback(
    (userId: string, update: Partial<User>) => {
      const newList = new UserStore(store.blackList.list());
      newList.update(userId, update);
      dispatch({ blackList: newList });
    },
    [store]
  );

  const whiteList = useCallback(() => {
    return store.whiteList.list();
  }, [store]);
  const whiteListAddUser = useCallback(
    (user: User) => {
      const newList = new UserStore(store.whiteList.list());
      newList.add(user);
      dispatch({ whiteList: newList });
    },
    [store]
  );
  const whiteListRemoveUser = useCallback(
    (userId: string) => {
      const newList = new UserStore(store.whiteList.list());
      newList.remove(userId);
      dispatch({ whiteList: newList });
    },
    [store]
  );
  const whiteListUpdateUser = useCallback(
    (userId: string, update: Partial<User>) => {
      const newList = new UserStore(store.whiteList.list());
      newList.update(userId, update);
      dispatch({ whiteList: newList });
    },
    [store]
  );

  return {
    get,
    toggleEnabled,
    switchBlocking,
    blackList,
    blackListAddUser,
    blackListRemoveUser,
    blackListUpdateUser,
    whiteList,
    whiteListAddUser,
    whiteListRemoveUser,
    whiteListUpdateUser,
  };
}
