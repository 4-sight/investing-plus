import {
  blackListAdd,
  blackListRemove,
  whiteListAdd,
  whiteListRemove,
} from ".";

export const sectionClassName = "i-plus-block-buttons";

const blackListIcon = `
<svg
  width="1rem"
  aria-hidden="true"
  focusable="false"
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
  width="1rem"
  aria-hidden="true"
  focusable="false"
  role="img"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 512 512"
  class="icon-shield-check"
  >
    <path
      fill="currentColor"
      d="M163.2 230.5c-4.7-4.7-12.3-4.7-17-.1l-22.7 22.5c-4.7 4.7-4.7 12.3-.1 17l90.8 91.5c4.7 4.7 12.3 4.7 17 .1l172.6-171.2c4.7-4.7 4.7-12.3.1-17l-22.5-22.7c-4.7-4.7-12.3-4.7-17-.1L223 290.7zM466.5 83.7l-192-80a48.15 48.15 0 0 0-36.9 0l-192 80C27.7 91.1 16 108.6 16 128c0 198.5 114.5 335.7 221.5 380.3 11.8 4.9 25.1 4.9 36.9 0C360.1 472.6 496 349.3 496 128c0-19.4-11.7-36.9-29.5-44.3zM256 464C158.5 423.4 64 297.3 64 128l192-80 192 80c0 173.8-98.4 297-192 336z">
    </path>
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
