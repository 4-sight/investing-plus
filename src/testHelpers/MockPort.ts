export class MockPort {
  name: string;
  onDisconnect: {
    addListener: (listener: Function) => void;
    clearListeners: () => void;
    removeListener: (listener: Function) => void;
    hasListeners: () => void;
    callListeners: () => void;
  };
  onMessage: {
    addListener: (listener: Function) => void;
    clearListeners: () => void;
    removeListener: (listener: Function) => void;
    hasListeners: () => void;
    callListeners: () => void;
  };
  private onDisconnectListeners: Function[];
  private onMessageListeners: Function[];

  constructor(id: number) {
    this.name = id.toString();
    this.onDisconnectListeners = [];
    this.onMessageListeners = [];
    this.onDisconnect = {
      addListener: this.addDisconnectListener,
      removeListener: this.removeDisconnectListener,
      clearListeners: this.clearDisconnectListeners,
      hasListeners: this.hasDisconnectListeners,
      callListeners: this.callDisconnectListeners,
    };

    this.onMessage = {
      addListener: this.addMessageListener,
      removeListener: this.removeMessageListener,
      clearListeners: this.clearMessageListeners,
      hasListeners: this.hasMessageListeners,
      callListeners: this.callMessageListeners,
    };
  }

  private addDisconnectListener = (listener: Function) => {
    this.onDisconnectListeners.push(listener);
  };
  private addMessageListener = (listener: Function) => {
    this.onMessageListeners.push(listener);
  };

  private removeDisconnectListener = (listener: Function) => {
    this.onDisconnectListeners = this.onDisconnectListeners.filter(
      (l) => l !== listener
    );
  };
  private removeMessageListener = (listener: Function) => {
    this.onMessageListeners = this.onMessageListeners.filter(
      (l) => l !== listener
    );
  };

  private clearDisconnectListeners = () => {
    this.onDisconnectListeners = [];
  };
  private clearMessageListeners = () => {
    this.onMessageListeners = [];
  };

  private hasDisconnectListeners = (): boolean => {
    return this.onDisconnectListeners.length > 0;
  };
  private hasMessageListeners = (): boolean => {
    return this.onMessageListeners.length > 0;
  };

  private callDisconnectListeners = () => {
    this.onDisconnectListeners.forEach((l) => l());
  };

  private callMessageListeners = () => {
    this.onMessageListeners.forEach((l) => l());
  };

  postMessage = jest.fn((message: Object) => {
    this.onMessageListeners.forEach((l) => l(message));
  });

  disconnect = () => {
    this.onDisconnectListeners.forEach((c) => c());
  };
}
