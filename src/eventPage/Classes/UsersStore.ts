import { User, Users, UserMap, UserIds } from "../../types";

export class UsersStore {
  private users: UserMap;
  private exampleUser: User;

  constructor(storeName: string, users?: Users) {
    this.exampleUser = { id: "example", name: "example" };

    if (users) {
      const sanitized = this.sanitizer(users);
      if (sanitized) {
        this.users = new Map(sanitized.map((u) => [u.id, u]));
      } else {
        this.users = new Map();
      }
    } else {
      this.users = new Map();
    }

    chrome.storage.sync.get([storeName], (res) => {
      if (storeName in res) {
        const sanitized = this.sanitizer(res[storeName]);
        if (sanitized) {
          this.users = new Map(sanitized.map((u) => [u.id, u]));
        } else {
          chrome.storage.sync.set({ [storeName]: [...this.getUsers()] });
        }
      } else {
        chrome.storage.sync.set({ [storeName]: [...this.getUsers()] });
      }
    });
  }

  private sanitizer = (users: any): Users | undefined => {
    let sanitized = [...users];
    const validKeys = Object.keys(this.exampleUser);

    if (Array.isArray(users)) {
      users.forEach((user) => {
        if (typeof user !== "object" || Array.isArray(user)) {
          sanitized = undefined;
          return;
        }

        const userKeys = Object.keys(user);

        if (userKeys.length !== validKeys.length) {
          sanitized = undefined;
          return;
        }

        userKeys.forEach((k) => {
          if (!validKeys.includes(k)) {
            sanitized = undefined;
            return;
          }

          if (typeof user[k] !== typeof this.exampleUser[k]) {
            sanitized = undefined;
            return;
          }
        });
      });
    }

    return sanitized;
  };

  getUsers = (): User[] => Array.from(this.users.values());

  getUserIds = (): UserIds => Array.from(this.users.keys());

  getUser = (id: string): User | undefined => this.users.get(id);

  createUser = (user: User): boolean => {
    if (this.users.get(user.id)) {
      return false;
    }

    this.users.set(user.id, user);
    return true;
  };

  deleteUser = (id: string): boolean => this.users.delete(id);
  updateUser = (id: string, update: Partial<User>): boolean => {
    const user = this.users.get(id);
    if (user) {
      this.users.set(id, { ...user, ...update });
      return true;
    }

    return false;
  };

  updateList = (users: Users) => {
    const sanitized = this.sanitizer(users);
    if (sanitized) {
      this.users = new Map(sanitized.map((u) => [u.id, u]));
    }
  };
}
