import React from "react";
import useGenStore from "./hooks/useGenStore";
import { Blocking } from "../types";

export default function Popup() {
  const [
    { enabled, blocking },
    { toggleEnabled, switchBlocking },
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
