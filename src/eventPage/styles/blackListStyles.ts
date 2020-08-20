import { Users, User } from "../../types";

export const blackListStyles = (blackList: Users): string =>
  blackList
    .reduce(
      (style: string, user: User) =>
        style + ` .js-comment[data-user-id="${user.id}"] {display: none;}`,
      ""
    )
    .trim();
