import { userBlocking, getBlockingStyles } from "../userBlocking";

describe("getBlockingStyles", () => {
  it("should return the expected string", () => {
    expect.assertions(1);
    const mockIds = ["1234", "2345", "3456"];

    expect(getBlockingStyles(mockIds)).toEqual(
      `.js-comment[data-user-id="${mockIds[0]}"] {display: none;} .js-comment[data-user-id="${mockIds[1]}"] {display: none;} .js-comment[data-user-id="${mockIds[2]}"] {display: none;}`
    );
  });
});

describe("userBlocking.enable", () => {
  it("should add the expected styles to a StyleMap", () => {
    expect.assertions(2);
    const mockMap = new Map();
    const mockIds = ["1234", "2345", "3456"];

    expect(mockMap.get(userBlocking.id)).toBeUndefined();
    userBlocking.enable(mockMap, mockIds);
    expect(mockMap.get(userBlocking.id)).toEqual(getBlockingStyles(mockIds));
  });
});

describe("userBlocking.disable", () => {
  it("should remove the expected styles from a StyleMap", () => {
    expect.assertions(2);
    const mockMap = new Map();
    const mockIds = ["1234", "2345", "3456"];

    userBlocking.enable(mockMap, mockIds);
    expect(mockMap.get(userBlocking.id)).toEqual(getBlockingStyles(mockIds));
    userBlocking.disable(mockMap);
    expect(mockMap.get(userBlocking.id)).toBeUndefined();
  });
});
