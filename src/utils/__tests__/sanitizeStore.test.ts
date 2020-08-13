import { getSanitizer } from "../";
import { defaults } from "../../testHelpers";
import { GeneralStoreState } from "../../types";

describe("getSanitizer", () => {
  it("should take a default store and return a function", () => {
    expect.assertions(1);

    const sanitizer = getSanitizer<GeneralStoreState>(() => ({
      ...defaults.generalStore,
    }));

    expect(typeof sanitizer).toEqual("function");
  });
});

describe("sanitizer", () => {
  const genSanitizer = getSanitizer<GeneralStoreState>(() => ({
    ...defaults.generalStore,
  }));

  const matchingValues = (store, baseLine): boolean => {
    let matching = true;
    Object.entries(store).forEach(([key, val]) => {
      if (typeof val !== typeof baseLine[key]) {
        matching = false;
      }
    });

    return matching;
  };

  it("should always return a valid store", () => {
    expect.assertions(10);

    // Has expected keys
    expect(Object.keys(genSanitizer({}))).toEqual(
      Object.keys(defaults.generalStore)
    );
    expect(Object.keys(genSanitizer(defaults.generalStore))).toEqual(
      Object.keys(defaults.generalStore)
    );
    expect(Object.keys(genSanitizer(""))).toEqual(
      Object.keys(defaults.generalStore)
    );
    expect(Object.keys(genSanitizer(undefined))).toEqual(
      Object.keys(defaults.generalStore)
    );
    expect(Object.keys(genSanitizer(false))).toEqual(
      Object.keys(defaults.generalStore)
    );
    expect(Object.keys(genSanitizer(true))).toEqual(
      Object.keys(defaults.generalStore)
    );
    expect(Object.keys(genSanitizer([{}, {}]))).toEqual(
      Object.keys(defaults.generalStore)
    );
    expect(
      Object.keys(genSanitizer({ ...defaults.generalStore, enabled: false }))
    ).toEqual(Object.keys(defaults.generalStore));

    // Values are of the expected type
    const dirtyGenStore = { blocking: "1", enabled: false };
    expect(matchingValues(dirtyGenStore, defaults.generalStore)).toBe(false);
    expect(
      matchingValues(genSanitizer(dirtyGenStore), defaults.generalStore)
    ).toBe(true);
  });
});
