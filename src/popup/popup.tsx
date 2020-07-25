import React from "react";
import { useStore } from "../hooks";

export default function Popup() {
  const [store, dispatch] = useStore();

  const toggleBlocking = () => {
    dispatch({ blocking: !store?.blocking });
  };

  const toggleEnabled = () => {
    dispatch({ enabled: !store?.enabled });
  };

  return (
    <div className={`popupContainer ${store?.enabled ? "enabled" : "disabled"}`}>
      Hello, world!
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleEnabled();
        }}
        style={{
          cursor: "pointer",
          backgroundColor: `${store?.enabled ? "green" : "red"}`,
          color: `${store?.enabled ? "white" : "black"}`,
        }}
      >
        Toggle Enabled
      </button>
      <button
        className={`blocking-toggle ${store?.blocking ? "enabled" : "disabled"}`}
        data-testid="blocking-toggle"
        onClick={(e) => {
          e.preventDefault();
          toggleBlocking();
        }}
        style={{
          cursor: "pointer",
          backgroundColor: `${store?.blocking ? "green" : "red"}`,
          color: `${store?.blocking ? "white" : "black"}`,
        }}
      >
        Toggle Blocking
      </button>
    </div>
  );
}
