import { Users, User } from "../../types";

export const highlightFavouriteStyles = (whiteList: Users) =>
  whiteList
    .reduce(
      (style: string, user: User) =>
        style +
        ` .js-comment[data-user-id="${user.id}"] {border: 2px solid blue;}`,
      ""
    )
    .trim();
