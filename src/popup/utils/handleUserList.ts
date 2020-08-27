import { SortOption, Users } from "../../types";

export const handleUserList = (
  users: Users,
  sortBy: SortOption,
  search: string
): Users => {
  let _users = [...users];

  if (search) {
    _users = _users.filter((user) =>
      user.name.trim().toLowerCase().includes(search.toLowerCase())
    );
  }

  switch (sortBy) {
    case "User Id high-low":
      return [..._users].sort((a, b) => {
        if (a.id < b.id) {
          return 1;
        }
        if (a.id > b.id) {
          return -1;
        }
        return 0;
      });

    case "User Id low-high":
      return [..._users].sort((a, b) => {
        if (a.id < b.id) {
          return -1;
        }
        if (a.id > b.id) {
          return 1;
        }
        return 0;
      });

    case "User Name A-Z":
      return [..._users].sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });

    case "User Name Z-A":
      return [..._users].sort((a, b) => {
        if (a.name < b.name) {
          return 1;
        }
        if (a.name > b.name) {
          return -1;
        }
        return 0;
      });

    case "Added latest":
      return [..._users].reverse();

    case "Added first":
      return [..._users];
  }
};
