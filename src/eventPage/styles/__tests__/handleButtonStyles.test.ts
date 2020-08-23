import { handleBlackListButtonStyles, handleWhiteListButtonStyles } from "..";
import { defaults } from "../../../testHelpers";

describe("handleBlackListButtonStyles", () => {
  it("should return a string", () => {
    expect.assertions(2);

    expect(typeof handleBlackListButtonStyles([])).toBe("string");
    expect(typeof handleBlackListButtonStyles([...defaults.userList()])).toBe(
      "string"
    );
  });

  it("should return style rules for each given user", () => {
    expect.assertions(3);

    const user1 = {
      name: "test-user-1",
      id: "555-1",
    };

    const user2 = {
      name: "test-user-2",
      id: "555-2",
    };

    const user3 = {
      name: "test-user-3",
      id: "555-3",
    };

    expect(
      handleBlackListButtonStyles([user1, user2, user3]).includes(
        `[data-user-id="${user1.id}"]`
      )
    ).toBe(true);
    expect(
      handleBlackListButtonStyles([user1, user2, user3]).includes(
        `[data-user-id="${user2.id}"]`
      )
    ).toBe(true);
    expect(
      handleBlackListButtonStyles([user1, user2, user3]).includes(
        `[data-user-id="${user3.id}"]`
      )
    ).toBe(true);
  });
});

//============================================

describe("handleWhiteListButtonStyles", () => {
  it("should return a string", () => {
    expect.assertions(2);

    expect(typeof handleWhiteListButtonStyles([])).toBe("string");
    expect(typeof handleWhiteListButtonStyles([...defaults.userList()])).toBe(
      "string"
    );
  });

  it("should return style rules for each given user ", () => {
    expect.assertions(3);

    const user1 = {
      name: "test-user-1",
      id: "555-1",
    };

    const user2 = {
      name: "test-user-2",
      id: "555-2",
    };

    const user3 = {
      name: "test-user-3",
      id: "555-3",
    };

    expect(
      handleWhiteListButtonStyles([user1, user2, user3]).includes(
        `[data-user-id="${user1.id}"]`
      )
    ).toBe(true);
    expect(
      handleWhiteListButtonStyles([user1, user2, user3]).includes(
        `[data-user-id="${user2.id}"]`
      )
    ).toBe(true);
    expect(
      handleWhiteListButtonStyles([user1, user2, user3]).includes(
        `[data-user-id="${user3.id}"]`
      )
    ).toBe(true);
  });
});
