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
  "TOGGLE_HIGHLIGHT_BLOCKED",
  "TOGGLE_HIGHLIGHT_FAVOURITE",
  "SET_BLOCKING",
  "GET_BLACKLIST",
  "GET_WHITELIST",
  "BLACKLIST_ADD",
  "BLACKLIST_REMOVE",
  "BLACKLIST_UPDATE_USER",
  "BLACKLIST_SWITCH_USER",
  "WHITELIST_ADD",
  "WHITELIST_REMOVE",
  "WHITELIST_UPDATE_USER",
  "WHITELIST_SWITCH_USER",
}

export type Message = {
  type: EventMessage;
  payload?: any;
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
  highlightFavourite: boolean;
  highlightBlocked: boolean;
};

export type ListName = "blackList" | "whiteList";
export type StoreName = ListName | "genStore";

export enum ScriptCommand {
  "INITIALIZE",
  "ENABLE",
  "DISABLE",
  "NEW_STYLE_RULES",
}

export enum StyleRule {
  "BLACKLIST",
  "WHITELIST",
  "HIGHLIGHT_BLOCKED",
  "HIGHLIGHT_FAVOURITE",
  "BLACKLIST_USER_BUTTONS",
  "WHITELIST_USER_BUTTONS",
}

export type PortMap = Map<number, PortHandler>;

export type StyleMap = Map<StyleRule, string>;

export type UpdatePorts = (options?: {
  sync?: StoreName[];
  stylesUpdate?: "all" | ListName;
}) => void;

export type UserContextActions = {
  add: (user: User) => void;
  remove: (user: User) => void;
  update: (user: User, update: Partial<User>) => void;
  switchList: (user: User) => void;
};

export type SortOption =
  | "User Name A-Z"
  | "User Name Z-A"
  | "User Id low-high"
  | "User Id high-low"
  | "Added latest"
  | "Added first";
