import { EventMessage, Command, ScriptCommand } from "../types";
import { Context } from "../Classes";

export default (context: Context) => {
  chrome.runtime.sendMessage({ type: EventMessage.CONTENT_SCRIPT_MOUNTED });
  chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener(portListener(context));
  });
};

export const portListener = (context: Context) => ({
  type,
  payload,
}: Command) => {
  switch (type) {
    case ScriptCommand.INITIALIZE:
      context.initializeStyles(payload);
      break;

    case ScriptCommand.ENABLE:
      context.enable();
      break;

    case ScriptCommand.DISABLE:
      context.disable();
      break;

    case ScriptCommand.UPDATE_BATCH:
      context.batchUpdateStyles(payload);
      break;

    case ScriptCommand.BLOCKING_SET:
      context.setBlocking(payload);
      break;

    default:
      break;
  }
};
