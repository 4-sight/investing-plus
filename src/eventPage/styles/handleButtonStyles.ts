import { Users, User } from "../../types";

export const handleBlackListButtonStyles = (blackList: Users) =>
  blackList.reduce(
    (style: string, user: User) =>
      style +
      `
        .white-list-add[data-user-id="${user.id}"] {display: none}
        .black-list-add[data-user-id="${user.id}"] {display: none}
        .white-list-remove[data-user-id="${user.id}"] {display: none}
        .black-list-remove[data-user-id="${user.id}"] {display: block !important}
      `,
    ""
  );

export const handleWhiteListButtonStyles = (whiteList: Users) =>
  whiteList.reduce(
    (style: string, user: User) =>
      style +
      `
        .white-list-add[data-user-id="${user.id}"] {display: none}
        .black-list-add[data-user-id="${user.id}"] {display: none}
        .black-list-remove[data-user-id="${user.id}"] {display: none}
        .white-list-remove[data-user-id="${user.id}"] {display: block !important}
      `,
    ""
  );
