import { defaultStores } from "../constants";
import { GeneralStoreState, Users, User } from "../types";

export const generalStore: GeneralStoreState = {
  ...defaultStores.generalStore(),
};

export const userList = (): Users => [
  {
    name: "test-user-1",
    id: "1234-1",
  },
  {
    name: "test-user-2",
    id: "1234-2",
  },
  {
    name: "test-user-3",
    id: "1234-3",
  },
];
