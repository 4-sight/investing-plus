import React, {
  useContext,
  createContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { blackListListener } from "../listeners/eventListener";
import { Users, EventMessage, User } from "../../types";

export type SetBlackList = React.Dispatch<React.SetStateAction<Users>>;

type Actions = {
  add: (user: User) => void;
  remove: (user: User) => void;
  update: (user: User, update: Partial<User>) => void;
  switchList: (user: User) => void;
};

//========================================================

export const BlackListStateContext = createContext<Users>([]);
export const BlackListActionsContext = createContext<Actions>({} as Actions);

//========================================================

export const BlackListStateProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [users, setUsers] = useState([] as Users);

  const listener = useMemo(() => blackListListener(setUsers), []);

  const add = (user: User) => {
    chrome.runtime.sendMessage({
      type: EventMessage.BLACKLIST_ADD,
      payload: user,
    });
  };
  const remove = (user: User) => {
    chrome.runtime.sendMessage({
      type: EventMessage.BLACKLIST_REMOVE,
      payload: user,
    });
  };
  const update = (user: User, update: Partial<User>) => {
    chrome.runtime.sendMessage({
      type: EventMessage.BLACKLIST_UPDATE_USER,
      payload: { user, update },
    });
  };
  const switchList = (user: User) => {
    chrome.runtime.sendMessage({
      type: EventMessage.BLACKLIST_SWITCH_USER,
      payload: user,
    });
  };

  useEffect(() => {
    // Add listener to runtime
    chrome.runtime.onMessage.addListener(listener);
    // Fetch blackList from eventPage
    chrome.runtime.sendMessage(
      { type: EventMessage.GET_BLACKLIST },
      (users) => {
        setUsers(users);
      }
    );

    // Remove listener on unmount
    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, [listener]);

  const actions: Actions = {
    add,
    remove,
    update,
    switchList,
  };

  return (
    <BlackListStateContext.Provider value={users}>
      <BlackListActionsContext.Provider value={actions}>
        {children}
      </BlackListActionsContext.Provider>
    </BlackListStateContext.Provider>
  );
};

export const useBlackListState = (): Users => useContext(BlackListStateContext);
export const useBlackListActions = (): Actions =>
  useContext(BlackListActionsContext);
