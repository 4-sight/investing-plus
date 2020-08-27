import { Users, User } from "../../types";
import colours from "../../popup/scss/colours.module.scss";

export const highlightBlockedStyles = (blackList: Users) =>
  blackList
    .reduce(
      (style: string, user: User) =>
        style +
        ` .js-comment[data-user-id="${user.id}"] {border: 2px solid ${colours.red1};}`,
      ""
    )
    .trim();
