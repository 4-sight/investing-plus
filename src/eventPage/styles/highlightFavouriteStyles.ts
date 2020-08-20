import { Users, User } from "../../types";

export const highlightFavouriteStyles = (whiteList: Users) =>
  whiteList
    .reduce(
      (style: string, user: User) =>
        style +
        ` .js-comment[data-user-id="${user.id}"] {border: 2px solid blue;} .list-add[data-user-id="${user.id}"], .black-list-remove[data-user-id="${user.id}"] {display: none}`,
      ""
    )
    .trim();
