import { StoreState, Blocking } from "../types";
import { UserStore } from "../Classes";

export const defaultStore: StoreState = {
  hidden: true,
  enabled: true,
  blocking: Blocking.NONE,
  blackList: new UserStore(),
  whiteList: new UserStore(),
};
