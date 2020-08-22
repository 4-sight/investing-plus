import React, { useState, useEffect, useMemo } from "react";
import { Users, EventMessage, Message, User } from "../../types";

type Actions = {
  add: (user: User) => void;
  remove: (user: User) => void;
  update: (user: User, update: Partial<User>) => void;
  moveToWhiteList: (user: User) => void;
};

export const getListener = (setUsers) => ({ type, payload }: Message) => {
  switch (type) {
    case EventMessage.BLACKLIST_UPDATED:
      setUsers(payload);
  }
};

export default function useBlackList(): [Users, Actions] {
  const [users, setUsers] = useState([]);

  const listener = useMemo(() => getListener(setUsers), []);

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
  const moveToWhiteList = (user: User) => {
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
  }, []);

  const actions: Actions = {
    add,
    remove,
    update,
    moveToWhiteList,
  };

  return [users, actions];
}
