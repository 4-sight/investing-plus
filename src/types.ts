import { ScriptState } from "./Classes";

export enum EventMessage {
  "STORE_GET_STORE",
  "STORE_OVERRIDE",
  "STORE_GET",
  "STORE_SET",
  "STORE_UPDATED",
}

export type Message = {
  type: EventMessage;
  payload: any;
};

export type StoreState = {
  enabled: boolean;
  blocking: boolean;
};

export enum ScriptCommand {
  "INITIALIZE",
  "ENABLE",
  "DISABLE",
  "UPDATE",
  "UPDATE_BATCH",
}

export type ScriptUpdate = [keyof ScriptState, any];

export type ScriptBatchUpdate = Partial<StoreState>;
