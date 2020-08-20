import { whiteListAdd, whiteListRemove } from "../index";
import { chrome } from "jest-chrome";
import { EventMessage } from "../../../types";

describe("whiteListAdd", () => {
  beforeEach(() => {
    chrome.runtime.sendMessage.mockClear();
  });

  it("should call runtime.sendMessage with a type of WHITELIST_ADD and a user payload", () => {
    expect.assertions(3);

    expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

    const user = { name: "test-user-name", id: "test-user-id" };
    const add = whiteListAdd(user.name, user.id);
    add({ preventDefault: () => {} } as any);

    expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
      type: EventMessage.WHITELIST_ADD,
      payload: user,
    });
  });
});

describe("whiteListRemove", () => {
  beforeEach(() => {
    chrome.runtime.sendMessage.mockClear();
  });

  it("should call runtime.sendMessage with a type of WHITELIST_REMOVE and a user payload", () => {
    expect.assertions(3);

    expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

    const user = { name: "test-user-name", id: "test-user-id" };
    const remove = whiteListRemove(user.name, user.id);
    remove({ preventDefault: () => {} } as any);

    expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
      type: EventMessage.WHITELIST_REMOVE,
      payload: user,
    });
  });
});
