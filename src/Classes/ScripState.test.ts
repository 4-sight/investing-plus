import { ScriptState } from ".";
import { defaults } from "../testHelpers";

describe("ScriptState", () => {
  it("should be a class", () => {
    const s = new ScriptState(defaults.store);

    expect(s).toBeInstanceOf(ScriptState);
  });
});
