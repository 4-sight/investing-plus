import { GeneralStoreState } from "../../types";
import { generalStore } from "../../constants/defaultStores";
import { getSanitizer, isGenuineUpdate } from "../../utils";

export class GeneralStore {
  state: GeneralStoreState;
  changes: Partial<GeneralStoreState>;
  private sanitizeState: (state: any) => GeneralStoreState;

  constructor(state: GeneralStoreState = generalStore()) {
    const sanitizer = getSanitizer(generalStore);
    this.state = sanitizer(state);
    this.sanitizeState = sanitizer;
    this.changes = {};
  }

  getState = (): GeneralStoreState => ({ ...this.state });
  setState = (newState: GeneralStoreState) => {
    const cleanState = this.sanitizeState(newState);
    this.state = cleanState;
    this.setChanges({ ...cleanState });
  };
  get = (key: keyof GeneralStoreState): any => {
    return this.state[key];
  };
  set = (update: Partial<GeneralStoreState>): boolean => {
    if (isGenuineUpdate(this.state, update)) {
      this.state = { ...this.state, ...update };
      this.setChanges(update);
      return true;
    }
    return false;
  };
  private setChanges = (changes: Partial<GeneralStoreState>) => {
    this.changes = changes;
  };
  getChanges = (): [Partial<GeneralStoreState>, number] => [
    this.changes,
    Object.keys(this.changes).length,
  ];
}
