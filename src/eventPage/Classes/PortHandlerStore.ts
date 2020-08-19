import { PortMap } from "../../types";
import { PortHandler } from ".";

export class PortHandlerStore {
  private ports: PortMap;

  constructor(initialPortMap?: PortMap) {
    this.ports = initialPortMap || new Map();
  }

  get = (id: number): PortHandler => this.ports.get(id);

  addPort = (id: number, port: PortHandler) => {
    this.ports.set(id, port);
  };

  removePort = (id: number) => (): void => {
    this.ports.delete(id);
  };

  enablePorts = () => {
    this.ports.forEach((port) => {
      port.enable();
    });
  };

  disablePorts = () => {
    this.ports.forEach((port) => {
      port.disable();
    });
  };

  updatePorts = (styles: string) => {
    this.ports.forEach((port) => {
      port.sendStyleRules(styles);
    });
  };
}
