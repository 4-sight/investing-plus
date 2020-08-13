import { SetGenStore } from "../hooks/useGenStore";
import { EventMessage } from "../../types";

const { GEN_STORE_UPDATED } = EventMessage;

export default (setGenStore: SetGenStore) => ({
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
