import { contextMenuListener } from "..";

describe("contextMenuListener", () => {
  // Setup

  let mockAddToBlackList;
  let mockAddToWhiteList;
  let listener;

  beforeEach(() => {
    mockAddToBlackList = jest.fn();
    mockAddToWhiteList = jest.fn();
    listener = contextMenuListener(mockAddToBlackList, mockAddToWhiteList);
  });

  //==========================================

  describe("menuItemId: add-to-blackList", () => {
    it("should call addToBlackList with the expected user", () => {
      expect.assertions(4);

      expect(mockAddToBlackList).not.toHaveBeenCalled();

      listener({
        menuItemId: "control",
      });

      expect(mockAddToBlackList).not.toHaveBeenCalled();

      listener({
        menuItemId: "add-to-blackList",
        linkUrl: "test-link/12345-6",
        selectionText: "test-user-name",
      });

      expect(mockAddToBlackList).toHaveBeenCalledTimes(1);
      expect(mockAddToBlackList).toHaveBeenCalledWith({
        name: "test-user-name",
        id: "12345-6",
      });
    });

    it("should do nothing if linkUrl is missing", () => {
      expect.assertions(2);

      expect(mockAddToBlackList).not.toHaveBeenCalled();

      listener({
        menuItemId: "add-to-blackList",
        selectionText: "test-user-name",
      });

      expect(mockAddToBlackList).not.toHaveBeenCalled();
    });

    it("should supply a default user.name if selectionText is undefined", () => {
      expect.assertions(3);

      expect(mockAddToBlackList).not.toHaveBeenCalled();

      listener({
        menuItemId: "add-to-blackList",
        linkUrl: "test-link/12345-6",
      });

      expect(mockAddToBlackList).toHaveBeenCalledTimes(1);
      expect(mockAddToBlackList).toHaveBeenCalledWith({
        name: "unknown user",
        id: "12345-6",
      });
    });
  });

  describe("menuItemId: add-to-whiteList", () => {
    it("should call addToWhiteList with the expected user", () => {
      expect.assertions(4);

      expect(mockAddToWhiteList).not.toHaveBeenCalled();

      listener({
        menuItemId: "control",
      });

      expect(mockAddToWhiteList).not.toHaveBeenCalled();

      listener({
        menuItemId: "add-to-whiteList",
        linkUrl: "test-link/12345-6",
        selectionText: "test-user-name",
      });

      expect(mockAddToWhiteList).toHaveBeenCalledTimes(1);
      expect(mockAddToWhiteList).toHaveBeenCalledWith({
        name: "test-user-name",
        id: "12345-6",
      });
    });

    it("should do nothing if linkUrl is missing ", () => {
      expect.assertions(2);

      expect(mockAddToWhiteList).not.toHaveBeenCalled();

      listener({
        menuItemId: "add-to-whiteList",
        selectionText: "test-user-name",
      });

      expect(mockAddToWhiteList).not.toHaveBeenCalled();
    });

    it("should supply a default user.name if selectionText is undefined ", () => {
      expect.assertions(3);

      expect(mockAddToWhiteList).not.toHaveBeenCalled();

      listener({
        menuItemId: "add-to-whiteList",
        linkUrl: "test-link/12345-6",
      });

      expect(mockAddToWhiteList).toHaveBeenCalledTimes(1);
      expect(mockAddToWhiteList).toHaveBeenCalledWith({
        name: "unknown user",
        id: "12345-6",
      });
    });
  });
});
