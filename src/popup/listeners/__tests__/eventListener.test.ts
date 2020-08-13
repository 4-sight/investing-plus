import eventListener from "../eventListener";
import { EventMessage } from "../../../types";
import { defaults } from "../../../testHelpers";

describe("eventListener", () => {
  // Setup
  const mockSetGenStore = jest.fn();
  let listener;

  beforeEach(() => {
    mockSetGenStore.mockClear();
    listener = eventListener(mockSetGenStore);
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
