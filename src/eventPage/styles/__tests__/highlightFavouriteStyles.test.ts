import { highlightFavouriteStyles } from "..";

describe("highlightFavouriteStyles", () => {
  it("should return a string referencing the expected elements", () => {
    expect.assertions(4);

    const whiteList1 = [
      { name: "test-name-1", id: "555-1" },
      { name: "test-name-2", id: "555-2" },
    ];
    const whiteList2 = [
      { name: "test-name-3", id: "555-3" },
      { name: "test-name-4", id: "555-4" },
    ];

    expect(
      highlightFavouriteStyles(whiteList1).includes(
        '.js-comment[data-user-id="555-1"]'
      )
    ).toBe(true);
    expect(
      highlightFavouriteStyles(whiteList1).includes(
        '.js-comment[data-user-id="555-2"]'
      )
    ).toBe(true);
    expect(
      highlightFavouriteStyles(whiteList2).includes(
        '.js-comment[data-user-id="555-3"]'
      )
    ).toBe(true);
    expect(
      highlightFavouriteStyles(whiteList2).includes(
        '.js-comment[data-user-id="555-4"]'
      )
    ).toBe(true);
  });
});
