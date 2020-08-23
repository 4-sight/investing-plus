import { Users, User } from "../../types";

export const whiteListStyles = (whiteList: Users): string =>
  whiteList.length > 0
    ? whiteList
        .reduce(
          (style: string, user: User) =>
            style + ` .js-comment[data-user-id="${user.id}"] {display: block;}`,
          ".js-comment {display: none;}"
        )
        .trim()
    : "";
