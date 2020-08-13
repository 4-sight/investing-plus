import { ScriptCommand } from "../../types";

export const portListener = (styleSheet) => ({
  type,
  payload,
}: {
  type: ScriptCommand;
  payload?: any;
}) => {
  switch (type) {
    case ScriptCommand.INITIALIZE:
      if (typeof payload.styles === "string") {
        styleSheet.innerHTML = payload.styles;

        if (payload.enabled) {
          document.body.appendChild(styleSheet);
        }
      } else {
        throw new Error(
          `Invalid style rules in port message.\nReceived: ${payload.styles}`
        );
      }
      break;

    case ScriptCommand.NEW_STYLE_RULES:
      if (typeof payload === "string") {
        styleSheet.innerHTML = payload;
      } else {
        throw new Error(
          `Invalid style rules in port message.\nReceived: ${payload}`
        );
      }
      break;

    case ScriptCommand.ENABLE:
      document.body.appendChild(styleSheet);
      break;

    case ScriptCommand.DISABLE:
      document.body.removeChild(styleSheet);
      break;
  }
};
