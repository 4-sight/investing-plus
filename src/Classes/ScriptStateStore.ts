import { ScriptState } from "./ScriptState";

export class ScriptStateStore {
  private state: ScriptState;

  constructor(state: ScriptState) {
    this.state = { ...state };
  }

  set(key: keyof ScriptState, val: any) {
    this.state[key] = val;
  }

  get(key: keyof ScriptState): any {
    return this.state[key];
  }

  overrideState(state: ScriptState) {
    this.state = { ...state };
  }
}
