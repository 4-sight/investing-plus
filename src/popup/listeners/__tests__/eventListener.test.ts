import {
  genStoreListener,
  blackListListener,
  whiteListListener,
} from "../eventListener";
import { EventMessage } from "../../../types";
import { defaults } from "../../../testHelpers";

describe("genStoreListener", () => {
  // Setup
  const mockSetGenStore = jest.fn();
  let listener;

  beforeEach(() => {
    mockSetGenStore.mockClear();
    listener = genStoreListener(mockSetGenStore);
  });
  //==========================================

  // Messages
  describe("GEN_STORE_UPDATED", () => {
    it("should call setStore with the updated store", () => {
      expect.assertions(3);

      const mockGenStoreState = defaults.generalStore;
      expect(mockSetGenStore).not.toHaveBeenCalled();

      listener({
        type: EventMessage.GEN_STORE_UPDATED,
        payload: mockGenStoreState,
      });

      expect(mockSetGenStore).toHaveBeenCalledTimes(1);
      expect(mockSetGenStore).toHaveBeenCalledWith(mockGenStoreState);
    });
  });
});

describe("blackListListener", () => {
  // Setup
  const mockSetBlackList = jest.fn();
  let listener;

  beforeEach(() => {
    mockSetBlackList.mockClear();
    listener = blackListListener(mockSetBlackList);
  });
  //==========================================

  // Messages
  describe("BLACKLIST_UPDATED", () => {
    it("should call setBlackList with the updated store", () => {
      expect.assertions(3);

      const mockBlackList = defaults.userList();
      expect(mockSetBlackList).not.toHaveBeenCalled();

      listener({
        type: EventMessage.BLACKLIST_UPDATED,
        payload: mockBlackList,
      });

      expect(mockSetBlackList).toHaveBeenCalledTimes(1);
      expect(mockSetBlackList).toHaveBeenCalledWith(mockBlackList);
    });
  });
});

describe("whiteListListener", () => {
  // Setup
  const mockSetWhiteList = jest.fn();
  let listener;

  beforeEach(() => {
    mockSetWhiteList.mockClear();
    listener = whiteListListener(mockSetWhiteList);
  });
  //==========================================

  // Messages
  describe("WHITELIST_UPDATED", () => {
    it("should call setWhiteList with the updated store", () => {
      expect.assertions(3);

      const mockWhiteList = defaults.userList();
      expect(mockSetWhiteList).not.toHaveBeenCalled();

      listener({
        type: EventMessage.WHITELIST_UPDATED,
        payload: mockWhiteList,
      });

      expect(mockSetWhiteList).toHaveBeenCalledTimes(1);
      expect(mockSetWhiteList).toHaveBeenCalledWith(mockWhiteList);
    });
  });
});
