import { SetGenStore } from "../context/GenStoreContext";
import { SetBlackList } from "../context/BlackListContext";
import { SetWhiteList } from "../context/WhiteListContext";
import { EventMessage } from "../../types";

const {
  GEN_STORE_UPDATED,
  BLACKLIST_UPDATED,
  WHITELIST_UPDATED,
} = EventMessage;

export const genStoreListener = (setGenStore: SetGenStore) => ({
  type,
  payload,
}: {
  type: EventMessage;
  payload?: any;
}) => {
  let responseIsAsync = false;

  switch (type) {
    case GEN_STORE_UPDATED:
      setGenStore(payload);
      break;

    default:
      break;
  }

  return responseIsAsync;
};

export const blackListListener = (setBlackList: SetBlackList) => ({
  type,
  payload,
}: {
  type: EventMessage;
  payload?: any;
}) => {
  switch (type) {
    case BLACKLIST_UPDATED:
      setBlackList(payload);
  }
};

export const whiteListListener = (setWhiteList: SetWhiteList) => ({
  type,
  payload,
}: {
  type: EventMessage;
  payload?: any;
}) => {
  switch (type) {
    case WHITELIST_UPDATED:
      setWhiteList(payload);
  }
};
