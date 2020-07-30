import { sanitizeStore } from "../";
import { defaultStore } from "../../constants";
import { StoreState, Blocking } from "../../types";
import { UserStore } from "../../Classes";

describe("sanitizeStore", () => {
  it("should return a StoreState", () => {
    expect.assertions(9);

    const defaultKeys = Object.keys(defaultStore());

    expect(Object.keys(sanitizeStore(undefined))).toEqual(defaultKeys);
    expect(Object.keys(sanitizeStore(""))).toEqual(defaultKeys);
    expect(Object.keys(sanitizeStore("store"))).toEqual(defaultKeys);
    expect(Object.keys(sanitizeStore(1))).toEqual(defaultKeys);
    expect(Object.keys(sanitizeStore([{}, 2, ""]))).toEqual(defaultKeys);
    expect(Object.keys(sanitizeStore([]))).toEqual(defaultKeys);
    expect(Object.keys(sanitizeStore({}))).toEqual(defaultKeys);
    expect(Object.keys(sanitizeStore(defaultStore))).toEqual(defaultKeys);
    expect(
      Object.keys(sanitizeStore({ ...defaultStore, testField: "test" }))
    ).toEqual(defaultKeys);
  });

  it("should return storeState with the given fields", () => {
    expect.assertions(4);

    const store1: StoreState = {
      ...defaultStore(),
      enabled: true,
      blocking: Blocking.WHITELIST,
    };

    const store2: StoreState = {
      ...defaultStore(),
      enabled: false,
      blocking: Blocking.BLACKLIST,
    };

    const sanitized1 = sanitizeStore(store1);

    expect(sanitized1.enabled).toEqual(store1.enabled);
    expect(sanitized1.blocking).toEqual(store1.blocking);

    const sanitized2 = sanitizeStore(store2);

    expect(sanitized2.enabled).toEqual(store2.enabled);
    expect(sanitized2.blocking).toEqual(store2.blocking);
  });

  it("should not return invalid fields", () => {
    expect.assertions(4);

    const invalidStore = {
      ...defaultStore(),
      enabled: true,
      blocking: Blocking.WHITELIST,
      invalidField1: "test",
      invalidField2: { test: 2 },
    };

    const sanitized = sanitizeStore(invalidStore);

    expect(sanitized.enabled).toEqual(invalidStore.enabled);
    expect(sanitized.blocking).toEqual(invalidStore.blocking);
    expect(sanitized).not.toHaveProperty("invalidField1");
    expect(sanitized).not.toHaveProperty("invalidField2");
  });

  it("should not return invalid values", () => {
    expect.assertions(4);

    const invalidStore = {
      ...defaultStore(),
      enabled: undefined,
      blocking: "0",
      blackList: [{ id: "123", name: "test-user" }],
      whiteList: new UserStore([{ id: "123", name: "test-user" }]),
    };

    const sanitized = sanitizeStore(invalidStore);

    expect(sanitized.enabled).not.toEqual(invalidStore.enabled);
    expect(sanitized.blocking).not.toEqual(invalidStore.blocking);
    expect(sanitized.blackList).not.toEqual(invalidStore.blackList);
    expect(sanitized.whiteList).toEqual(invalidStore.whiteList);
  });
});
