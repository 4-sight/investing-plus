import { Ports, ScriptStateChanges } from "../types";
import { PortHandler } from "./PortHandler";

export class PortStore {
  private ports: Ports;

  constructor(initialPortMap?: Ports) {
    this.ports = initialPortMap || new Map();
  }

  addPort = (id: number, port: PortHandler) => {
    this.ports.set(id, port);
  };

  removePort = (id: number) => (): void => {
    this.ports.delete(id);
  };

  updatePorts = ([changes, n]: [ScriptStateChanges, number]) => {
    if (n > 1) {
      this.ports.forEach((port) => {
        port.batchUpdate(changes);
      });
    } else {
      this.ports.forEach((port) => {
        const change = Object.keys(changes)[0];

        switch (change) {
          case "blocking":
            if (changes.blocking) {
              port.blocking.enable();
            } else {
              port.blocking.disable();
            }
            break;

          case "enabled":
            if (changes.enabled) {
              port.enable();
            } else {
              port.disable();
            }
            break;
        }
      });
    }
  };
}
