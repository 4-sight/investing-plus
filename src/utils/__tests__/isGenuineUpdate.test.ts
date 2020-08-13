import { isGenuineUpdate } from "../";
import { defaults } from "../../testHelpers";
import { Blocking } from "../../types";

describe("isGenuineUpdate", () => {
  it("should return true if update is valid", () => {
    expect.assertions(2);

    expect(isGenuineUpdate(defaults.generalStore, { enabled: false })).toBe(
      true
    );
    expect(
      isGenuineUpdate(defaults.generalStore, { blocking: Blocking.NONE })
    ).toBe(true);
  });

  it("should return false if update is invalid", () => {
    expect.assertions(8);

    expect(isGenuineUpdate(defaults.generalStore, {})).toBe(false);

    expect(isGenuineUpdate(defaults.generalStore, [] as any)).toBe(false);

    expect(isGenuineUpdate(defaults.generalStore, 1 as any)).toBe(false);

    expect(isGenuineUpdate(defaults.generalStore, true as any)).toBe(false);

    expect(isGenuineUpdate(defaults.generalStore, "" as any)).toBe(false);

    expect(
      isGenuineUpdate(defaults.generalStore, [{ user: "test" }] as any)
    ).toBe(false);

    expect(
      isGenuineUpdate(defaults.generalStore, { invalidField: "test" } as any)
    ).toBe(false);

    expect(
      isGenuineUpdate(defaults.generalStore, {
        enabled: true,
        invalidField: "test",
      } as any)
    ).toBe(false);
  });
});
