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

    const u = new UsersStore("test");
    expect(u).toBeInstanceOf(UsersStore);
  });

  it("should call chrome.storage.sync.get and set the store state if given", () => {
    expect.assertions(4);

    const mockSyncStore: Users = [
      {
        name: "mock-user-1",
        id: "0987-1",
      },
      {
        name: "mock-user-2",
        id: "0987-2",
      },
      {
        name: "mock-user-3",
        id: "0987-3",
      },
    ];
    chrome.storage.sync.get.mockImplementationOnce((keys: string[], cb) => {
      cb({ [keys[0]]: mockSyncStore });
    });
    expect(chrome.storage.sync.get).not.toHaveBeenCalled();

    const store = new UsersStore("testList", defaults.userList());
    expect(chrome.storage.sync.get).toHaveBeenCalledTimes(1);
    expect(chrome.storage.sync.get.mock.calls[0][0]).toEqual(["testList"]);
    expect(store.getUsers()).toEqual(mockSyncStore);
  });

  it("should call chrome.storage.sync.set if there is no userStore in storage", () => {
    expect.assertions(6);

    chrome.storage.sync.get.mockImplementationOnce((keys: string[], cb) => {
      cb({});
    });
    expect(chrome.storage.sync.get).not.toHaveBeenCalled();
    expect(chrome.storage.sync.set).not.toHaveBeenCalled();

    new UsersStore("testList", defaults.userList());
    expect(chrome.storage.sync.get).toHaveBeenCalledTimes(1);
    expect(chrome.storage.sync.set).toHaveBeenCalledTimes(1);

    expect(chrome.storage.sync.get.mock.calls[0][0]).toEqual(["testList"]);
    expect(chrome.storage.sync.set.mock.calls[0][0]).toEqual({
      testList: [...defaults.userList()],
    });
  });

  it("should call chrome.storage.sync.set if there is an invalid userStore in storage", () => {
    expect.assertions(6);

    const invalidSyncStore = [
      {
        name: "mock-user-1",
        id: "0987-1",
      },
      {
        name: "mock-user-2",
        id: "0987-2",
        invalidField: true,
      },
      {
        name: "mock-user-3",
        id: "0987-3",
      },
    ];
    chrome.storage.sync.get.mockImplementationOnce((keys: string[], cb) => {
      cb({ [keys[0]]: invalidSyncStore });
    });
    expect(chrome.storage.sync.get).not.toHaveBeenCalled();
    expect(chrome.storage.sync.set).not.toHaveBeenCalled();

    new UsersStore("testList");
    expect(chrome.storage.sync.get).toHaveBeenCalledTimes(1);
    expect(chrome.storage.sync.set).toHaveBeenCalledTimes(1);

    expect(chrome.storage.sync.get.mock.calls[0][0]).toEqual(["testList"]);
    expect(chrome.storage.sync.set.mock.calls[0][0]).toEqual({
      testList: [],
    });
  });

  it("should contain a valid store state", () => {
    expect.assertions(5);

    expect(new UsersStore("test").getUsers()).toEqual([]);
    expect(new UsersStore("test", defaults.userList()).getUsers()).toEqual(
      defaults.userList()
    );
    expect(
      new UsersStore("test", [{ name: "test-user", id: "1234-15" }]).getUsers()
    ).toEqual([{ name: "test-user", id: "1234-15" }]);
    expect(
      new UsersStore("test", [
        ...defaults.userList(),
        { name: "test-user", id: 1234 - 15 },
      ] as any).getUsers()
    ).toEqual([]);
    expect(
      new UsersStore("test", [
        ...defaults.userList(),
        { name: "test-user", id: "1234-15", invalidField: true },
      ] as any).getUsers()
    ).toEqual([]);
  });

  describe("Method - getUsers", () => {
    it("should return an array of users", () => {
      expect.assertions(4);

      const store1 = new UsersStore("test");
      const store2 = new UsersStore("test", defaults.userList());

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

      const store1 = new UsersStore("test");
      const store2 = new UsersStore("test", defaults.userList());

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

      const store1 = new UsersStore("test");
      const store2 = new UsersStore("test", defaults.userList());
      const id = defaults.userList()[0].id;

      expect(store1.getUser(id)).toBeUndefined();
      expect(store2.getUser(id)).toEqual(defaults.userList()[0]);
    });
  });

  describe("Method - createUser", () => {
    it("should should add a user, and return a boolean", () => {
      expect.assertions(4);

      const store1 = new UsersStore("test");
      const store2 = new UsersStore("test", defaults.userList());
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

      const store1 = new UsersStore("test");
      const store2 = new UsersStore("test", defaults.userList());
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

      const store1 = new UsersStore("test");
      const store2 = new UsersStore("test", defaults.userList());
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

      const store1 = new UsersStore("test");
      const store2 = new UsersStore("test", defaults.userList());
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

      const store1 = new UsersStore("test");
      const store2 = new UsersStore("test", defaults.userList());

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
