import { whiteList, getWhiteListStyles } from "../whiteList";

describe("getWhiteListStyles", () => {
  it("should return the expected string", () => {
    expect.assertions(1);
    const mockIds = ["1234", "2345", "3456"];

    expect(getWhiteListStyles(mockIds)).toEqual(
      `.js-comment {display: none;} .js-comment[data-user-id="${mockIds[0]}"] {display: block;} .js-comment[data-user-id="${mockIds[1]}"] {display: block;} .js-comment[data-user-id="${mockIds[2]}"] {display: block;}`
    );
  });
});

describe("whiteList.enable", () => {
  it("should add the expected styles to a StyleMap", () => {
    expect.assertions(2);
    const mockMap = new Map();
    const mockIds = ["1234", "2345", "3456"];

    expect(mockMap.get(whiteList.id)).toBeUndefined();
    whiteList.enable(mockMap, mockIds);
    expect(mockMap.get(whiteList.id)).toEqual(getWhiteListStyles(mockIds));
  });
});

describe("whiteList.disable", () => {
  it("should remove the expected styles from a StyleMap", () => {
    expect.assertions(2);
    const mockMap = new Map();
    const mockIds = ["1234", "2345", "3456"];

    whiteList.enable(mockMap, mockIds);
    expect(mockMap.get(whiteList.id)).toEqual(getWhiteListStyles(mockIds));
    whiteList.disable(mockMap);
    expect(mockMap.get(whiteList.id)).toBeUndefined();
  });
});
