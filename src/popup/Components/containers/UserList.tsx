import React from "react";
import { Users, UserContextActions, ListName } from "../../../types";
import UserListAction from "../inputs/UserListAction";
import TrashCan from "../../icons/TrashCan";
import SwapArrows from "../../icons/SwapArrows";

interface Props {
  users: Users;
  actions: UserContextActions;
  list: ListName;
}

export default function UserList({ users, actions, list }: Props) {
  return (
    <div className="user-list-wrapper">
      <div className="user-list-headers">
        <div
          id={`${list}-user-name-header`}
          className="user-list-header user-list-name-header"
        >
          User Name
        </div>
        <div
          id={`${list}-user-id-header`}
          className="user-list-header user-list-id-header"
        >
          User Id
        </div>
      </div>
      <div className="user-list-users">
        {users.map((user) => (
          <div className="user-list-row" data-user-id={user.id}>
            <div className="user-list-user-name">{user.name}</div>
            <div className="user-list-user-id">{user.id}</div>
            <div className="user-list-user-actions">
              <UserListAction
                title="Remove user"
                className="remove-user-button"
                action={(e) => {
                  e.preventDefault();
                  actions.remove(user);
                }}
                Icon={() => <TrashCan />}
              />
              <UserListAction
                title={`Switch User To ${
                  list === "blackList" ? "Favourites" : "Blocked"
                }`}
                className="switch-list-button"
                action={(e) => {
                  e.preventDefault();
                  actions.switchList(user);
                }}
                Icon={() => <SwapArrows />}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
