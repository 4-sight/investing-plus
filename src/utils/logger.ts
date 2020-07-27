import { EventMessage } from "../types";

export default (section: string) => {
  chrome.runtime.onMessage.addListener((req) => {
    let log = `${section}: Message received `;

    if ("type" in req) {
      log += EventMessage[req.type];
    }
    log += ": ";

    console.log(log, req);
  });
};
