import { StyleMap, GeneralStoreState, Blocking } from "../../types";

export const generateRules = (
  styles: StyleMap,
  genState: GeneralStoreState
): string => {
  const activeStyles = [];

  switch (genState.blocking) {
    case Blocking.BLACKLIST:
      {
        const blackListed = styles.get("blackList");
        blackListed && activeStyles.push(blackListed);
      }
      break;

    case Blocking.WHITELIST:
      {
        const whiteListed = styles.get("whiteList");
        whiteListed && activeStyles.push(whiteListed);
      }
      break;

    case Blocking.HIGHLIGHT:
      {
        const highlighted = styles.get("highlight");
        highlighted && activeStyles.push(highlighted);
      }
      break;

    case Blocking.NONE:
      break;
  }
  return activeStyles.join(" ");
};
