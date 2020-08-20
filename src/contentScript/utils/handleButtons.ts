import {
  blackListAdd,
  blackListRemove,
  whiteListAdd,
  whiteListRemove,
} from ".";

export const sectionClassName = "i-plus-block-buttons";

export const addButtons = (
  comments = Array.from(document.getElementsByClassName("js-comment"))
) => {
  if (comments.length > 0) {
    comments.forEach((comment) => {
      const userId = comment.attributes["data-user-id"]?.value;
      const userNameElement = comment.getElementsByClassName("js-user-name")[0];
      const userName = userNameElement.textContent;

      const buttonsDiv = document.createElement("div");
      buttonsDiv.className = sectionClassName;

      const blackListAddButton = document.createElement("button");
      blackListAddButton.textContent = "BL";
      blackListAddButton.className = "black-list-add list-add";
      blackListAddButton.setAttribute("data-user-id", userId);
      blackListAddButton.onclick = blackListAdd(userName, userId);

      const blackListRemoveButton = document.createElement("button");
      blackListRemoveButton.textContent = "UnBL";
      blackListRemoveButton.className = "black-list-remove list-remove";
      blackListRemoveButton.setAttribute("data-user-id", userId);
      blackListRemoveButton.onclick = blackListRemove(userName, userId);

      const whiteListAddButton = document.createElement("button");
      whiteListAddButton.textContent = "WL";
      whiteListAddButton.className = "white-list-add list-add";
      whiteListAddButton.setAttribute("data-user-id", userId);
      whiteListAddButton.onclick = whiteListAdd(userName, userId);

      const whiteListRemoveButton = document.createElement("button");
      whiteListRemoveButton.textContent = "UnWL";
      whiteListRemoveButton.className = "white-list-remove list-remove";
      whiteListRemoveButton.setAttribute("data-user-id", userId);
      whiteListRemoveButton.onclick = whiteListRemove(userName, userId);

      buttonsDiv.append(
        blackListAddButton,
        blackListRemoveButton,
        whiteListAddButton,
        whiteListRemoveButton
      );
      userNameElement.parentNode.append(buttonsDiv);
    });
  }
};

export const removeButtons = () => {
  const buttonSections = document.getElementsByClassName(sectionClassName);

  if (buttonSections.length > 0) {
    Array.from(buttonSections).forEach((section) => {
      section.parentNode.removeChild(section);
    });
  }
};
