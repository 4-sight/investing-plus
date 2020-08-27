import React, { useState } from "react";

import {
  useWhiteListState,
  useWhiteListActions,
} from "../../context/WhiteListContext";
import { SortOption } from "../../../types";
import { userListSortOptions } from "../../../constants";
import { handleUserList } from "../../utils/handleUserList";

import UserList from "../containers/UserList";
import UserListSort from "../inputs/UserListSort";
import UserListSearch from "../inputs/UserListSearch";

export default function FavouriteUsers() {
  const users = useWhiteListState();
  const actions = useWhiteListActions();
  const [sortBy, setSortBy] = useState<SortOption>("User Name A-Z");
  const [search, setSearch] = useState<string>("");

  return (
    <div className="favourite-users-body">
      <div className="list-manipulation-section">
        <UserListSort
          label="Sort by:"
          options={userListSortOptions}
          status={sortBy}
          action={(option: SortOption) => {
            setSortBy(option);
          }}
        />
        <UserListSearch
          label="Search User Name: "
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();
            setSearch(e.target.value);
          }}
        />
      </div>
      <UserList
        list="whiteList"
        users={handleUserList(users, sortBy, search)}
        actions={actions}
      />
    </div>
  );
}
