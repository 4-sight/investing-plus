import { User } from "../types";

export class UserStore {
  private users: Map<string, User>;
  constructor(arr?: User[]) {
    if (arr) {
      this.users = new Map(arr.map((i) => [i.id, i]));
    } else {
      this.users = new Map();
    }
  }

  public list = () => {
    return Array.from(this.users.values());
  };

  public listIds = () => {
    return Array.from(this.users.keys());
  };

  public get = (id: string) => {
    return this.users.get(id);
  };

  public add = (user: User) => {
    this.users.set(user.id, user);
  };

  public remove = (id: string) => {
    this.users.delete(id);
  };

  public clear = () => {
    this.users.clear();
  };

  public update = (id: string, update: Partial<User>) => {
    const user = this.users.get(id);
    if (user) {
      this.users.set(user.id, { ...user, ...update });
    }
  };
}
