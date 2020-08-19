import { whiteListUser } from "../index";
import { chrome } from "jest-chrome";
import { EventMessage } from "../../../types";

describe("whiteListUser", () => {
  beforeEach(() => {
    chrome.runtime.sendMessage.mockClear();
  });

  it("should call runtime.sendMessage with a type of WHITELIST_ADD and a user payload", () => {
    expect.assertions(3);

    expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

    const user = { name: "test-user-name", id: "test-user-id" };
    const blackList = whiteListUser(user.name, user.id);
    blackList({ preventDefault: () => {} } as any);

    expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
      type: EventMessage.WHITELIST_ADD,
      payload: user,
    });
  });
});
