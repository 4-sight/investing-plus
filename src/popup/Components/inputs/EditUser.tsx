import React, { useState } from "react";
import { User } from "../../../types";

import Close from "../../icons/Close";

interface Props {
  user: User;
  updateUser: (user: User, update: Partial<User>) => void;
  closeModal: () => void;
}

export default function EditUser({ user, updateUser, closeModal }: Props) {
  const [userName, setUserName] = useState<string>(user.name);
  const [error, setError] = useState<string>("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setUserName(e.target.value);

    if (error.length > 0) {
      if (validateUserName(e.target.value)) {
        setError("");
      }
    }
  };

  const validateUserName = (userName: any): boolean => {
    if (typeof userName !== "string") {
      return false;
    }

    if (userName.trim().length < 1) {
      return false;
    }

    return true;
  };

  const onSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (validateUserName(userName)) {
      updateUser(user, { name: userName });
      closeModal();
    } else {
      setError("Please Enter a valid user name");
    }
  };

  return (
    <div className="edit-user-modal">
      <div className="screen-blocker" onClick={closeModal} />
      <div className="modal-container">
        <div className="header">
          <h3 className="title">Edit User</h3>
          <button className="close-modal" onClick={closeModal}>
            <Close />
          </button>
        </div>
        <div className="input-section">
          <label htmlFor="edit-user-name" className="input-label">
            User Name:
          </label>
          <input
            placeholder="Enter User Name"
            id="edit-user-name"
            className={`edit-user-name ${
              error.length > 0 ? "invalid-input" : ""
            }`}
            data-testid="edit-user-name"
            onChange={onChange}
            type="text"
            value={userName}
            autoFocus={true}
          />
          {error.length > 0 && <div className="invalid-feedback">{error}</div>}
        </div>
        <button className="submit" data-testid="submit" onClick={onSubmit}>
          Confirm
        </button>
      </div>
    </div>
  );
}
