import { isMessage } from "../";
import { EventMessage } from "../../types";

describe("isMessage", () => {
  it("should return false for non-message arguments", () => {
    expect.assertions(6);
    expect(isMessage(1)).toBe(false);
    expect(isMessage("true")).toBe(false);
    expect(isMessage(true)).toBe(false);
    expect(isMessage(["message"])).toBe(false);
    expect(isMessage("message")).toBe(false);
    expect(isMessage({ message: "message" })).toBe(false);
  });

  it("should return true for a valid message argument", () => {
    expect.assertions(2);
    expect(isMessage({ type: EventMessage.STORE_GET })).toBe(true);
    expect(
      isMessage({ type: EventMessage.STORE_SET, payload: { enabled: true } })
    ).toBe(true);
  });
});
