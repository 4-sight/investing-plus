import React from "react";
import { Page } from "../../Popup";

interface Props {
  page: Page;
  action: () => void;
  active: boolean;
}

export default function NavButton({ page, action, active }: Props) {
  return (
    <button
      className="nav-button"
      onClick={(e) => {
        e.preventDefault();
        action();
      }}
    >
      {page}
      {active && <div className="nav-button-active" />}
    </button>
  );
}
