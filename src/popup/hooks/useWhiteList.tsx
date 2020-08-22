import React, { useState, useEffect, useMemo } from "react";
import { Users, EventMessage, Message, User } from "../../types";

type Actions = {
  add: (user: User) => void;
  remove: (user: User) => void;
  update: (user: User, update: Partial<User>) => void;
  moveToBlackList: (user: User) => void;
};

export const getListener = (setUsers) => ({ type, payload }: Message) => {
  switch (type) {
    case EventMessage.WHITELIST_UPDATED:
      setUsers(payload);
  }
};

export default function useWhiteList(): [Users, Actions] {
  const [users, setUsers] = useState([]);

  const listener = useMemo(() => getListener(setUsers), []);

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
  const moveToBlackList = (user: User) => {
    chrome.runtime.sendMessage({
      type: EventMessage.WHITELIST_SWITCH_USER,
      payload: user,
    });
  };

  useEffect(() => {
    // Add listener to runtime
    chrome.runtime.onMessage.addListener(listener);
    // Fetch blackList from eventPage
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
  }, []);

  const actions: Actions = {
    add,
    remove,
    update,
    moveToBlackList,
  };

  return [users, actions];
}
