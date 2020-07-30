import { defaultStore } from "../constants";
import { StoreState } from "../types";
import { UserStore } from "../Classes";

export const store: StoreState = {
  ...defaultStore(),
  blackList: new UserStore([
    {
      name: "test-user-1",
      id: "1234",
    },
    {
      name: "test-user-2",
      id: "2345",
    },
    {
      name: "test-user-3",
      id: "3456",
    },
  ]),
  whiteList: new UserStore([
    {
      name: "test-user-4",
      id: "4567",
    },
    {
      name: "test-user-5",
      id: "5678",
    },
    {
      name: "test-user-6",
      id: "6789",
    },
  ]),
};
