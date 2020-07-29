import React, { useEffect } from "react";
import { useStore } from "../hooks";
import { logger } from "../utils";
import { Blocking } from "../types";

export default function Popup() {
  const store = useStore();

  useEffect(() => {
    return logger("POPUP");
  }, []);

  return (
    <div
      className={`popupContainer ${
        store.get("enabled") ? "enabled" : "disabled"
      }`}
    >
      Hello, world!
      <button
        data-testid="toggle-enabled"
        onClick={(e) => {
          e.preventDefault();
          store.toggleEnabled();
        }}
        style={{
          cursor: "pointer",
          backgroundColor: `${store.get("enabled") ? "green" : "red"}`,
          color: `${store.get("enabled") ? "white" : "black"}`,
        }}
      >
        Toggle Enabled
      </button>
      <button
        className="blocking-switch"
        data-testid="blocking-switch"
        onClick={(e) => {
          e.preventDefault();
          store.switchBlocking();
        }}
        style={{
          cursor: "pointer",
          backgroundColor: "blue",
          color: "white",
        }}
      >
        {`Blocking: ${Blocking[store.get("blocking")]}`}
      </button>
    </div>
  );
}
