import { blackList, getBlackListStyles } from "../blackList";

describe("getBlackListStyles", () => {
  it("should return the expected string", () => {
    expect.assertions(1);
    const mockIds = ["1234", "2345", "3456"];

    expect(getBlackListStyles(mockIds)).toEqual(
      `.js-comment[data-user-id="${mockIds[0]}"] {display: none;} .js-comment[data-user-id="${mockIds[1]}"] {display: none;} .js-comment[data-user-id="${mockIds[2]}"] {display: none;}`
    );
  });
});

describe("blackList.enable", () => {
  it("should add the expected styles to a StyleMap", () => {
    expect.assertions(2);
    const mockMap = new Map();
    const mockIds = ["1234", "2345", "3456"];

    expect(mockMap.get(blackList.id)).toBeUndefined();
    blackList.enable(mockMap, mockIds);
    expect(mockMap.get(blackList.id)).toEqual(getBlackListStyles(mockIds));
  });
});

describe("blackList.disable", () => {
  it("should remove the expected styles from a StyleMap", () => {
    expect.assertions(2);
    const mockMap = new Map();
    const mockIds = ["1234", "2345", "3456"];

    blackList.enable(mockMap, mockIds);
    expect(mockMap.get(blackList.id)).toEqual(getBlackListStyles(mockIds));
    blackList.disable(mockMap);
    expect(mockMap.get(blackList.id)).toBeUndefined();
  });
});
