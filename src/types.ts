import { PortHandler } from "./eventPage/Classes";

export enum Blocking {
  "BLACKLIST",
  "WHITELIST",
  "NONE",
}

export enum EventMessage {
  "CONTENT_SCRIPT_MOUNTED",
  "POPUP_MOUNTED",
  "GEN_STORE_UPDATED",
  "BLACKLIST_UPDATED",
  "WHITELIST_UPDATED",
  "TOGGLE_ENABLED",
  "SWITCH_BLOCKING",
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

export type Users = User[];
export type UserIds = string[];

export type UserMap = Map<string, User>;

export type GeneralStoreState = {
  enabled: boolean;
  blocking: Blocking;
};

// export type StoreDispatch = (payload: Partial<StoreState>) => void;

export enum ScriptCommand {
  "INITIALIZE",
  "ENABLE",
  "DISABLE",
  "NEW_STYLE_RULES",
}

export type StyleMap = Map<string, string>;

export type PortMap = Map<number, PortHandler>;
