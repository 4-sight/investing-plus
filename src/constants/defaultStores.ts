import { GeneralStoreState, Blocking } from "../types";

export const generalStore = (): GeneralStoreState => ({
  enabled: true,
  blocking: Blocking.NONE,
});
