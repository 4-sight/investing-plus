import { StyleMap } from "../types";

const id = "user-whiteList";

export const getWhiteListStyles: (userIds: string[]) => string = (userIds) => {
  let styleRules = ".js-comment {display: none;} ";

  styleRules += userIds
    .map((userId) => `.js-comment[data-user-id="${userId}"] {display: block;}`)
    .join(" ");

  return styleRules;
};

export const whiteList: {
  id: string;
  enable: (styles: StyleMap, userIds: string[]) => void;
  disable: (styles: StyleMap) => void;
} = {
  id,
  enable: (styles, userIds) => {
    styles.set(id, getWhiteListStyles(userIds));
  },
  disable: (styles) => {
    styles.delete(id);
  },
};
