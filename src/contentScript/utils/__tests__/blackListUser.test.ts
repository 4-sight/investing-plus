import { blackListUser } from "../index";
import { chrome } from "jest-chrome";
import { EventMessage } from "../../../types";

describe("blackListUser", () => {
  beforeEach(() => {
    chrome.runtime.sendMessage.mockClear();
  });

  it("should call runtime.sendMessage with a type of BLACKLIST_ADD and a user payload", () => {
    expect.assertions(3);

    expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

    const user = { name: "test-user-name", id: "test-user-id" };
    const blackList = blackListUser(user.name, user.id);
    blackList({ preventDefault: () => {} } as any);

    expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
      type: EventMessage.BLACKLIST_ADD,
      payload: user,
    });
  });
});
