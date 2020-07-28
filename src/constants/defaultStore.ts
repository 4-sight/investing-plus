import { StoreState, Blocking } from "../types";

export const defaultStore: StoreState = {
  hidden: true,
  enabled: true,
  blocking: Blocking.NONE,
  blackList: [],
  whiteList: [],
};
