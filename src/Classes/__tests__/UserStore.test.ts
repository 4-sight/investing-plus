import { UserStore } from "../";
import { User } from "../../types";

describe("UserStore", () => {
  // Setup

  let users: User[];

  beforeEach(() => {
    users = [
      {
        id: "1",
        name: "test-user-1",
      },
      {
        id: "2",
        name: "test-user-2",
      },
      {
        id: "3",
        name: "test-user-3",
      },
      {
        id: "4",
        name: "test-user-4",
      },
    ];
  });

  //================================

  it("should be a class", () => {
    expect.assertions(1);

    const u = new UserStore();
    expect(u).toBeInstanceOf(UserStore);
  });

  describe("Method - list", () => {
    it("should return an array of users", () => {
      expect.assertions(1);

      const store = new UserStore(users);

      expect(store.list()).toEqual(users);
    });
  });

  describe("Method - listIds", () => {
    it("should return an array of user ids", () => {
      expect.assertions(1);

      const store = new UserStore(users);

      expect(store.listIds()).toEqual(users.map((i) => i.id));
    });
  });

  describe("Method - get", () => {
    it("should  return a user by id", () => {
      expect.assertions(1);

      const store = new UserStore(users);

      expect(store.get(users[0].id)).toEqual(users[0]);
    });
  });

  describe("Method - add", () => {
    it("should add a user", () => {
      expect.assertions(2);

      const newUser: User = {
        id: "234",
        name: "new-test-user",
      };
      const store = new UserStore(users);
      expect(store.get("234")).toBeUndefined();

      store.add(newUser);

      expect(store.get("234")).toEqual(newUser);
    });
  });

  describe("Method - remove", () => {
    it("should remove a user", () => {
      expect.assertions(2);

      const store = new UserStore(users);
      expect(store.get("1")).toEqual(users[0]);

      store.remove("1");

      expect(store.get("1")).toBeUndefined();
    });
  });

  describe("Method - clear", () => {
    it("should remove all users", () => {
      expect.assertions(2);

      const store = new UserStore(users);
      expect(store.list().length).toEqual(users.length);

      store.clear();

      expect(store.list().length).toEqual(0);
    });
  });

  describe("Method - update", () => {
    it("should update a user", () => {
      expect.assertions(2);

      const newName = "updated-name";
      const store = new UserStore(users);
      expect(store.get("1")).toEqual(users[0]);

      store.update("1", { name: newName });

      expect(store.get("1")).toEqual({ ...users[0], name: newName });
    });
  });
});
