import { ScriptState } from "./Classes";

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
  blocking: boolean;
  blackList: User[];
  whiteList: User[];
};

export type StoreDispatch = (payload: Partial<StoreState>) => void;

export enum ScriptCommand {
  "INITIALIZE",
  "ENABLE",
  "DISABLE",
  "UPDATE_BATCH",
  "BLOCKING_ENABLE",
  "BLOCKING_DISABLE",
}

export type ScriptUpdate = [keyof ScriptState, any];

export type ScriptBatchUpdate = Partial<StoreState>;

export type StyleMap = Map<string, string>;
