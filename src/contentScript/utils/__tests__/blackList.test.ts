import { blackListAdd, blackListRemove } from "../index";
import { chrome } from "jest-chrome";
import { EventMessage } from "../../../types";

describe("blackListAdd", () => {
  beforeEach(() => {
    chrome.runtime.sendMessage.mockClear();
  });

  it("should call runtime.sendMessage with a type of BLACKLIST_ADD and a user payload", () => {
    expect.assertions(3);

    expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

    const user = { name: "test-user-name", id: "test-user-id" };
    const add = blackListAdd(user.name, user.id);
    add({ preventDefault: () => {} } as any);

    expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
      type: EventMessage.BLACKLIST_ADD,
      payload: user,
    });
  });
});

describe("blackListRemove", () => {
  beforeEach(() => {
    chrome.runtime.sendMessage.mockClear();
  });

  it("should call runtime.sendMessage with a type of BLACKLIST_REMOVE and a user payload", () => {
    expect.assertions(3);

    expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

    const user = { name: "test-user-name", id: "test-user-id" };
    const remove = blackListRemove(user.name, user.id);
    remove({ preventDefault: () => {} } as any);

    expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
      type: EventMessage.BLACKLIST_REMOVE,
      payload: user,
    });
  });
});
