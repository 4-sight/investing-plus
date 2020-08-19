import { addButtons } from "../utils";

const observerList: MutationObserver[] = [];

export const mutationListener = (
  mutationList: MutationRecord[],
  observer: MutationObserver
) => {
  for (let mutation of mutationList) {
    if (mutation.type === "childList") {
      const elements = [];
      mutation.addedNodes.forEach((node) => {
        if (node instanceof Element) {
          const element = node as Element;
          if (element.classList.contains("js-comment")) {
            elements.push(element);
          }
        }
      });

      if (elements.length > 0) {
        addButtons(elements);
      }
    }
  }
};

export const addMutationListener = (observers = observerList) => {
  const config = { childList: true, subtree: true };

  const observer = new MutationObserver(mutationListener);
  observers.push(observer);
  const discussions = document.getElementsByClassName("js-comments-wrapper")[0];

  if (discussions) {
    observer.observe(discussions, config);
  }
};

export const removeMutationListeners = (observers = observerList) => {
  observers.forEach((observer) => {
    observer.disconnect();
  });
  observers.length = 0;
};
