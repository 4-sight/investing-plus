import {
  blackListAdd,
  blackListRemove,
  whiteListAdd,
  whiteListRemove,
} from ".";

export const sectionClassName = "i-plus-block-buttons";

const blackListIcon = `
<svg
  width="1.3rem"
  aria-hidden="true"
  focusable="false"
  data-prefix="fas"
  data-icon="ban"
  class="svg-inline--fa fa-ban fa-w-16 "
  role="img"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 512 512"
  >
  <path
    fill="currentColor"
    d="M256 8C119.034 8 8 119.033 8 256s111.034 248 248 248 248-111.034 248-248S392.967 8 256 8zm130.108 117.892c65.448 65.448 70 165.481 20.677 235.637L150.47 105.216c70.204-49.356 170.226-44.735 235.638 20.676zM125.892 386.108c-65.448-65.448-70-165.481-20.677-235.637L361.53 406.784c-70.203 49.356-170.226 44.736-235.638-20.676z"
  ></path>
</svg>
`;

const whiteListIcon = `
<svg
  width="1.3rem"
  aria-hidden="true"
  focusable="false"
  data-prefix="fas"
  data-icon="check-circle"
  class="svg-inline--fa fa-check-circle fa-w-16 "
  role="img"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 512 512"
  >
  <path
    fill="currentColor"
    d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
  ></path>
</svg>
`;

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
      blackListAddButton.innerHTML = blackListIcon;
      blackListAddButton.title = "Block user";
      blackListAddButton.className =
        "black-list-add list-add i-plus-list-button";
      blackListAddButton.setAttribute("data-user-id", userId);
      blackListAddButton.onclick = blackListAdd(userName, userId);

      const blackListRemoveButton = document.createElement("button");
      blackListRemoveButton.innerHTML = blackListIcon;
      blackListRemoveButton.title = "Unblock user";
      blackListRemoveButton.className =
        "black-list-remove list-remove i-plus-list-button";
      blackListRemoveButton.setAttribute("data-user-id", userId);
      blackListRemoveButton.onclick = blackListRemove(userName, userId);

      const whiteListAddButton = document.createElement("button");
      whiteListAddButton.innerHTML = whiteListIcon;
      whiteListAddButton.title = "Add user to favourites";
      whiteListAddButton.className =
        "white-list-add list-add i-plus-list-button";
      whiteListAddButton.setAttribute("data-user-id", userId);
      whiteListAddButton.onclick = whiteListAdd(userName, userId);

      const whiteListRemoveButton = document.createElement("button");
      whiteListRemoveButton.innerHTML = whiteListIcon;
      whiteListRemoveButton.title = "Remove user from favourites";
      whiteListRemoveButton.className =
        "white-list-remove list-remove i-plus-list-button";
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
