import React, {
  useContext,
  createContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { whiteListListener } from "../listeners/eventListener";
import { Users, EventMessage, User } from "../../types";

export type SetWhiteList = React.Dispatch<React.SetStateAction<Users>>;

type Actions = {
  add: (user: User) => void;
  remove: (user: User) => void;
  update: (user: User, update: Partial<User>) => void;
  switchList: (user: User) => void;
};

//=======================================================

export const WhiteListStateContext = createContext<Users>([]);
export const WhiteListActionsContext = createContext<Actions>({} as Actions);

//=======================================================

export const WhiteListStateProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [users, setUsers] = useState([] as Users);

  const listener = useMemo(() => whiteListListener(setUsers), []);

  const add = (user: User) => {
    chrome.runtime.sendMessage({
      type: EventMessage.WHITELIST_ADD,
      payload: user,
    });
  };
  const remove = (user: User) => {
    chrome.runtime.sendMessage({
      type: EventMessage.WHITELIST_REMOVE,
      payload: user,
    });
  };
  const update = (user: User, update: Partial<User>) => {
    chrome.runtime.sendMessage({
      type: EventMessage.WHITELIST_UPDATE_USER,
      payload: { user, update },
    });
  };
  const switchList = (user: User) => {
    chrome.runtime.sendMessage({
      type: EventMessage.WHITELIST_SWITCH_USER,
      payload: user,
    });
  };

  useEffect(() => {
    // Add listener to runtime
    chrome.runtime.onMessage.addListener(listener);
    // Fetch whiteList from eventPage
    chrome.runtime.sendMessage(
      { type: EventMessage.GET_WHITELIST },
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
    <WhiteListStateContext.Provider value={users}>
      <WhiteListActionsContext.Provider value={actions}>
        {children}
      </WhiteListActionsContext.Provider>
    </WhiteListStateContext.Provider>
  );
};

export const useWhiteListState = (): Users => useContext(WhiteListStateContext);
export const useWhiteListActions = (): Actions =>
  useContext(WhiteListActionsContext);
