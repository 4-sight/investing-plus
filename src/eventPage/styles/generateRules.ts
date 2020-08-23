import { StyleMap, GeneralStoreState, Blocking, StyleRule } from "../../types";

export const generateRules = (
  styles: StyleMap,
  genState: GeneralStoreState
): string => {
  const activeStyles = [];

  switch (genState.blocking) {
    case Blocking.BLACKLIST:
      {
        const blackListed = styles.get(StyleRule.BLACKLIST);
        blackListed && activeStyles.push(blackListed);
      }
      break;

    case Blocking.WHITELIST:
      {
        const whiteListed = styles.get(StyleRule.WHITELIST);
        whiteListed && activeStyles.push(whiteListed);
      }
      break;

    case Blocking.NONE:
      break;
  }

  if (genState.highlightBlocked && genState.blocking === Blocking.NONE) {
    {
      const blocked = styles.get(StyleRule.HIGHLIGHT_BLOCKED);
      blocked && activeStyles.push(blocked);
    }
  }

  if (genState.highlightFavourite && genState.blocking !== Blocking.WHITELIST) {
    {
      const fav = styles.get(StyleRule.HIGHLIGHT_FAVOURITE);
      fav && activeStyles.push(fav);
    }
  }

  activeStyles.push(styles.get(StyleRule.BLACKLIST_USER_BUTTONS));
  activeStyles.push(styles.get(StyleRule.WHITELIST_USER_BUTTONS));

  return activeStyles.join(" ").trim();
};
