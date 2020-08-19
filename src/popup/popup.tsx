import React from "react";
import useGenStore from "./hooks/useGenStore";
import { Blocking } from "../types";

export default function Popup() {
  const [
    { enabled, blocking, highlightBlocked, highlightFavourite },
    {
      toggleEnabled,
      toggleHighlightBlocked,
      toggleHighlightFavourite,
      switchBlocking,
    },
  ] = useGenStore();
  return (
    <div className={`popupContainer ${enabled ? "enabled" : "disabled"}`}>
      IV+
      <button
        data-testid="toggle-enabled"
        onClick={(e) => {
          e.preventDefault();
          toggleEnabled();
        }}
        style={{
          cursor: "pointer",
          backgroundColor: `${enabled ? "green" : "red"}`,
          color: `${enabled ? "white" : "black"}`,
        }}
      >
        {enabled ? "Disable" : "Enable"}
      </button>
      {blocking === Blocking.NONE && (
        <button
          data-testid="toggle-highlight-blocked"
          onClick={(e) => {
            e.preventDefault();
            toggleHighlightBlocked();
          }}
          style={{
            cursor: "pointer",
            backgroundColor: `${highlightBlocked ? "green" : "red"}`,
            color: `${highlightBlocked ? "white" : "black"}`,
          }}
        >
          Highlight Blocked
          <br />
          {highlightBlocked ? "OFF" : "ON"}
        </button>
      )}
      {blocking !== Blocking.WHITELIST && (
        <button
          data-testid="toggle-highlight-favourite"
          onClick={(e) => {
            e.preventDefault();
            toggleHighlightFavourite();
          }}
          style={{
            cursor: "pointer",
            backgroundColor: `${highlightFavourite ? "green" : "red"}`,
            color: `${highlightFavourite ? "white" : "black"}`,
          }}
        >
          Highlight Favourite
          <br />
          {highlightFavourite ? "OFF" : "ON"}
        </button>
      )}
      <button
        data-testid="switch-blocking"
        onClick={(e) => {
          e.preventDefault();
          switchBlocking();
        }}
        style={{
          cursor: "pointer",
          backgroundColor: "blue",
          color: "white",
        }}
      >
        {`Blocking: ${Blocking[blocking]}`}
      </button>
    </div>
  );
}
