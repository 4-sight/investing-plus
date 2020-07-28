import { StyleMap } from "../types";

const id = "user-blackList";

export const getBlackListStyles: (userIds: string[]) => string = (userIds) =>
  userIds
    .map((userId) => `.js-comment[data-user-id="${userId}"] {display: none;}`)
    .join(" ");

export const blackList: {
  id: string;
  enable: (styles: StyleMap, userIds: string[]) => void;
  disable: (styles: StyleMap) => void;
} = {
  id,
  enable: (styles, userIds) => {
    styles.set(id, getBlackListStyles(userIds));
  },
  disable: (styles) => {
    styles.delete(id);
  },
};
