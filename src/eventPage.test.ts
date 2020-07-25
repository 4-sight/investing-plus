import { EventHandler } from "./eventPage";
import { chrome } from "jest-chrome";
import { defaultStore } from "./constants";

describe("EventHandler", () => {
  beforeEach(() => {
    chrome.runtime.onMessage.clearListeners();
  });

  it("should be a Class", () => {
    expect.assertions(1);
    let h = new EventHandler(defaultStore);
    expect(h).toBeInstanceOf(EventHandler);
  });
});
