import { blackListUser, whiteListUser } from ".";

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

      const blackListButton = document.createElement("button");
      blackListButton.textContent = "BL";
      blackListButton.onclick = blackListUser(userName, userId);

      const whiteListButton = document.createElement("button");
      whiteListButton.textContent = "WL";
      whiteListButton.onclick = whiteListUser(userName, userId);

      buttonsDiv.append(blackListButton, whiteListButton);
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
