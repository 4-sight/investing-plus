import React from "react";
import { Page } from "../Popup";
import NavButton from "./inputs/NavButton";

interface Props {
  page: Page;
  setPage: (page: Page) => void;
}

export default function Navbar({ page, setPage }: Props) {
  return (
    <nav className="nav-bar">
      <NavButton
        page="Dashboard"
        active={page === "Dashboard"}
        action={() => {
          setPage("Dashboard");
        }}
      />
      <NavButton
        page="Blocked Users"
        active={page === "Blocked Users"}
        action={() => {
          setPage("Blocked Users");
        }}
      />
      <NavButton
        page="Favourite Users"
        active={page === "Favourite Users"}
        action={() => {
          setPage("Favourite Users");
        }}
      />
    </nav>
  );
}
