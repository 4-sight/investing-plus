import { Users, User } from "../../types";
import colours from "../../popup/scss/colours.module.scss";

export const highlightBlockedStyles = (blackList: Users) =>
  blackList
    .reduce(
      (style: string, user: User) =>
        style +
        ` .js-comment[data-user-id="${user.id}"] {border: 2px solid ${colours.red1}; border-radius: 5px;  margin: 0.5rem 0;} .js-comment-reply[data-user-id="${user.id}"] {padding: 1rem; margin: 0.5rem;} .js-comment-reply[data-user-id="${user.id}"] .commentInnerWrapper {border-top: none; padding-top: 0;}`,
      ""
    )
    .trim();
