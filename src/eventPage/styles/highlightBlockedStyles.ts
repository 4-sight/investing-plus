import { Users, User } from "../../types";

export const highlightBlockedStyles = (blackList: Users) =>
  blackList
    .reduce(
      (style: string, user: User) =>
        style +
        ` .js-comment[data-user-id="${user.id}"] {border: 2px solid red;} .list-add[data-user-id="${user.id}"], .white-list-remove[data-user-id="${user.id}"] {display: none}`,
      ""
    )
    .trim();
