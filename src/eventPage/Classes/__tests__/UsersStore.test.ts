import { UsersStore } from "../";
import { defaults } from "../../../testHelpers";
import { chrome } from "jest-chrome";
import { Users } from "../../../types";

describe("UsersStore", () => {
  // Setup

  beforeEach(() => {
    chrome.storage.sync.set.mockClear();
    chrome.storage.sync.get.mockClear();
  });

  //================================

  it("should be a class", () => {
    expect.assertions(1);

    const u = new UsersStore("blackList");
    expect(u).toBeInstanceOf(UsersStore);
  });

  it("should contain a valid store state", () => {
    expect.assertions(5);

    expect(new UsersStore("blackList").getUsers()).toEqual([]);
    expect(new UsersStore("blackList", defaults.userList()).getUsers()).toEqual(
      defaults.userList()
    );
    expect(
      new UsersStore("blackList", [
        { name: "test-user", id: "1234-15" },
      ]).getUsers()
    ).toEqual([{ name: "test-user", id: "1234-15" }]);
    expect(
      new UsersStore("blackList", [
        ...defaults.userList(),
        { name: "test-user", id: 1234 - 15 },
      ] as any).getUsers()
    ).toEqual([]);
    expect(
      new UsersStore("blackList", [
        ...defaults.userList(),
        { name: "test-user", id: "1234-15", invalidField: true },
      ] as any).getUsers()
    ).toEqual([]);
  });

  describe("Method - getUsers", () => {
    it("should return an array of users", () => {
      expect.assertions(4);

      const store1 = new UsersStore("whiteList");
      const store2 = new UsersStore("whiteList", defaults.userList());

      const users1 = store1.getUsers();
      const users2 = store2.getUsers();

      expect;
      expect(users1).not.toBeUndefined();
      expect(Array.isArray(users1)).toBe(true);
      expect(users1.length).toBe(0);

      expect(users2[0]).toEqual(defaults.userList()[0]);
    });
  });

  describe("Method - getUserIds", () => {
    it("should return an array of user ids", () => {
      expect.assertions(4);

      const store1 = new UsersStore("blackList");
      const store2 = new UsersStore("blackList", defaults.userList());

      const userIds1 = store1.getUserIds();
      const userIds2 = store2.getUserIds();

      expect;
      expect(userIds1).not.toBeUndefined();
      expect(Array.isArray(userIds1)).toBe(true);
      expect(userIds1.length).toBe(0);

      expect(userIds2[0]).toEqual(defaults.userList()[0].id);
    });
  });

  describe("Method - getUser", () => {
    it("should return the corresponding user or undefined", () => {
      expect.assertions(2);

      const store1 = new UsersStore("blackList");
      const store2 = new UsersStore("blackList", defaults.userList());
      const id = defaults.userList()[0].id;

      expect(store1.getUser(id)).toBeUndefined();
      expect(store2.getUser(id)).toEqual(defaults.userList()[0]);
    });
  });

  describe("Method - createUser", () => {
    it("should should add a user, and return a boolean", () => {
      expect.assertions(4);

      const store1 = new UsersStore("blackList");
      const store2 = new UsersStore("blackList", defaults.userList());
      const user = defaults.userList()[0];

      expect(store1.getUser(user.id)).toBeUndefined();
      expect(store1.createUser(user)).toEqual(true);
      expect(store1.getUser(user.id)).toEqual(user);

      expect(store2.createUser(user)).toEqual(false);
    });
  });

  describe("Method - deleteUser", () => {
    it("should delete a user, and return a boolean", () => {
      expect.assertions(4);

      const store1 = new UsersStore("blackList");
      const store2 = new UsersStore("blackList", defaults.userList());
      const user = defaults.userList()[0];

      expect(store1.deleteUser(user.id)).toEqual(false);

      expect(store2.getUser(user.id)).toEqual(user);
      expect(store2.deleteUser(user.id)).toEqual(true);
      expect(store2.getUser(user.id)).toBeUndefined();
    });
  });

  describe("Method - updateUser", () => {
    it("should update a user, and return a boolean", () => {
      expect.assertions(4);

      const store1 = new UsersStore("blackList");
      const store2 = new UsersStore("blackList", defaults.userList());
      const user = defaults.userList()[0];
      const update = { name: "new-test-name" };

      expect(store1.updateUser(user.id, update)).toEqual(false);

      expect(store2.getUser(user.id)).toEqual(user);
      expect(store2.updateUser(user.id, update)).toEqual(true);
      expect(store2.getUser(user.id)).toEqual({ ...user, ...update });
    });
  });

  describe("Method - updateList", () => {
    it("should replace contents with new Users list, if valid", () => {
      expect.assertions(4);

      const store1 = new UsersStore("blackList");
      const store2 = new UsersStore("blackList", defaults.userList());
      const updatedUsersList = [
        ...defaults.userList(),
        { name: "new-user-1", id: "555-1" },
      ];

      expect(store1.getUsers()).toEqual([]);
      store1.updateList(updatedUsersList);
      expect(store1.getUsers()).toEqual(updatedUsersList);

      expect(store2.getUsers()).toEqual(defaults.userList());
      store2.updateList(updatedUsersList);
      expect(store2.getUsers()).toEqual(updatedUsersList);
    });

    it("should do nothing if new Users list is invalid", () => {
      expect.assertions(4);

      const store1 = new UsersStore("whiteList");
      const store2 = new UsersStore("whiteList", defaults.userList());

      const invalidUsersList = [
        ...defaults.userList(),
        { name: "new-user-1", id: 333 },
      ];

      expect(store1.getUsers()).toEqual([]);
      store1.updateList(invalidUsersList as any);
      expect(store1.getUsers()).toEqual([]);

      expect(store2.getUsers()).toEqual(defaults.userList());
      store2.updateList(invalidUsersList as any);
      expect(store2.getUsers()).toEqual(defaults.userList());
    });
  });
});
