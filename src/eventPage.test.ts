import { EventHandler } from "./eventPage";
import { chrome } from "jest-chrome";
import { defaults } from "./testHelpers";

describe("EventHandler", () => {
  beforeEach(() => {
    chrome.runtime.onMessage.clearListeners();
  });

  it("should be a Class", () => {
    let h = new EventHandler(defaults.store);
    expect(h).toBeInstanceOf(EventHandler);
  });
});
