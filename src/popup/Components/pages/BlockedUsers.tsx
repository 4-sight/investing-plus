import React, { useState } from "react";

import {
  useBlackListState,
  useBlackListActions,
} from "../../context/BlackListContext";
import { SortOption, User } from "../../../types";
import { userListSortOptions } from "../../../constants";
import { handleUserList } from "../../utils/handleUserList";

import UserList from "../containers/UserList";
import UserListSort from "../inputs/UserListSort";
import UserListSearch from "../inputs/UserListSearch";
import EditUser from "../inputs/EditUser";

export default function BlockedUsers() {
  const users = useBlackListState();
  const actions = useBlackListActions();
  const [sortBy, setSortBy] = useState<SortOption>("User Name A-Z");
  const [search, setSearch] = useState<string>("");
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const closeModal = () => {
    setShowEdit(false);
    setSelectedUser(null);
  };

  const editUser = (user: User) => {
    setSelectedUser(user);
    setShowEdit(true);
  };

  return (
    <div className="blocked-users-body">
      {showEdit && selectedUser && (
        <EditUser
          user={selectedUser}
          closeModal={closeModal}
          updateUser={actions.update}
        />
      )}
      <div className="list-manipulation-section">
        <UserListSort
          label="Sort By:"
          options={userListSortOptions}
          status={sortBy}
          action={(option: SortOption) => {
            setSortBy(option);
          }}
        />
        <UserListSearch
          label="Search User Name:"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();
            setSearch(e.target.value);
          }}
        />
      </div>
      <UserList
        list="blackList"
        users={handleUserList(users, sortBy, search)}
        actions={actions}
        editUser={editUser}
      />
    </div>
  );
}
