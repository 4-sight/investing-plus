import { PortHandler, ScriptState, UserStore } from "./Classes";

export enum Blocking {
  "BLACKLIST",
  "WHITELIST",
  "NONE",
}

export enum EventMessage {
  "STORE_GET_STORE",
  "STORE_OVERRIDE",
  "STORE_GET",
  "STORE_SET",
  "STORE_UPDATED",
  "CONTENT_SCRIPT_MOUNTED",
}

export type Message = {
  type: EventMessage;
  payload: any;
};

export type Command = {
  type: ScriptCommand;
  payload?: any;
};

export type User = {
  id: string;
  name: string;
};

export type StoreState = {
  enabled: boolean;
  blocking: Blocking;
  blackList: UserStore;
  whiteList: UserStore;
  hidden: boolean;
};

export type StoreDispatch = (payload: Partial<StoreState>) => void;

export type UseStore = {
  get: (key: keyof StoreState) => any;
  toggleEnabled: () => void;
  switchBlocking: () => void;
  blackList: () => User[];
  blackListAddUser: (user: User) => void;
  blackListRemoveUser: (userId: string) => void;
  blackListUpdateUser: (userId: string, update: Partial<User>) => void;
  whiteList: () => User[];
  whiteListAddUser: (user: User) => void;
  whiteListRemoveUser: (userId: string) => void;
  whiteListUpdateUser: (userId: string, update: Partial<User>) => void;
};

export enum ScriptCommand {
  "INITIALIZE",
  "ENABLE",
  "DISABLE",
  "UPDATE_BATCH",
  "BLOCKING_SET",
}

export type ScriptStateChanges = Partial<ScriptState>;

export type StyleMap = Map<string, string>;

export type Ports = Map<number, PortHandler>;
