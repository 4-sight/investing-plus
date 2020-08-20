import { blackListStyles } from "..";

describe("blackListStyles", () => {
  it("should return a string referencing the expected elements", () => {
    expect.assertions(4);

    const blackList1 = [
      { name: "test-name-1", id: "555-1" },
      { name: "test-name-2", id: "555-2" },
    ];
    const blackList2 = [
      { name: "test-name-3", id: "555-3" },
      { name: "test-name-4", id: "555-4" },
    ];

    expect(
      blackListStyles(blackList1).includes('.js-comment[data-user-id="555-1"]')
    ).toBe(true);
    expect(
      blackListStyles(blackList1).includes('.js-comment[data-user-id="555-2"]')
    ).toBe(true);
    expect(
      blackListStyles(blackList2).includes('.js-comment[data-user-id="555-3"]')
    ).toBe(true);
    expect(
      blackListStyles(blackList2).includes('.js-comment[data-user-id="555-4"]')
    ).toBe(true);
  });
});
