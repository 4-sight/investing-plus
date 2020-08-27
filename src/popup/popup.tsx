import React, { useState } from "react";
import {
  useGenStoreActions,
  useGenStoreState,
} from "./context/GenStoreContext";
import Header from "./Components/Header";
import Navbar from "./Components/Navbar";
import Dashboard from "./Components/pages/Dashboard";
import BlockedUsers from "./Components/pages/BlockedUsers";
import FavouriteUsers from "./Components/pages/FavouriteUsers";

export type Page = "Dashboard" | "Blocked Users" | "Favourite Users";

export const handlePage = (page: Page) => {
  switch (page) {
    case "Dashboard":
      return <Dashboard />;

    case "Blocked Users":
      return <BlockedUsers />;

    case "Favourite Users":
      return <FavouriteUsers />;
  }
};

export default function Popup() {
  const { enabled } = useGenStoreState();
  const { toggleEnabled } = useGenStoreActions();

  const [page, setPage] = useState<Page>("Dashboard");

  return (
    <div className={`popupContainer ${enabled ? "enabled" : "disabled"}`}>
      <Header {...{ enabled, toggleEnabled, page, setPage }} />
      <Navbar {...{ page, setPage }} />
      <div className="popup-body">{handlePage(page)}</div>
    </div>
  );
}
