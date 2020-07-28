import { EventMessage } from "../types";

const getListener = (section: string) => (req) => {
  let log = `${section}: Message received `;

  if ("type" in req) {
    log += EventMessage[req.type];
  }
  log += ": ";

  console.log(log, req);
};

export default (section: string) => {
  const listener = getListener(section);
  chrome.runtime.onMessage.addListener(listener);

  return () => {
    chrome.runtime.onMessage.removeListener(listener);
  };
};
