import { Users, User } from "../../types";

export const whiteListStyles = (whiteList: Users): string =>
  whiteList.length > 0
    ? whiteList
        .reduce(
          (style: string, user: User) =>
            style +
            ` .js-comment[data-user-id="${user.id}"] {display: block;} .list-add[data-user-id="${user.id}"], .black-list-remove[data-user-id="${user.id}"] {display: none;}`,
          ".js-comment {display: none;}"
        )
        .trim()
    : "";
