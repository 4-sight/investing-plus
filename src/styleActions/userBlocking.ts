import { StyleMap } from "../types";

const id = "user-blocking";

export const getBlockingStyles: (userIds: string[]) => string = (userIds) =>
  userIds
    .map((userId) => `.js-comment[data-user-id="${userId}"] {display: none;}`)
    .join(" ");

export const userBlocking: {
  id: string;
  enable: (styles: StyleMap, userIds: string[]) => void;
  disable: (styles: StyleMap) => void;
} = {
  id,
  enable: (styles, userIds) => {
    styles.set(id, getBlockingStyles(userIds));
  },
  disable: (styles) => {
    styles.delete(id);
  },
};
