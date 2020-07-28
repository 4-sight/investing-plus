import { StoreState } from "../types";

export const defaultStore: StoreState = {
  hidden: true,
  enabled: true,
  blocking: true,
  blackList: [],
  whiteList: [],
};
