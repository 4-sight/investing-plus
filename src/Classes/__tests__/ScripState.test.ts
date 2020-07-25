import { ScriptState } from "..";
import { defaultStore } from "../../constants";

describe("ScriptState", () => {
  it("should be a class", () => {
    expect.assertions(1);
    const s = new ScriptState(defaultStore);

    expect(s).toBeInstanceOf(ScriptState);
  });
});
