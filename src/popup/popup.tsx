import React, { useEffect } from "react";
import { useStore } from "../hooks";
import { logger } from "../utils";
import { Blocking } from "../types";

export default function Popup() {
  const [store, dispatch] = useStore();

  const switchBlocking = () => {
    dispatch({ blocking: (store.blocking + 4) % 3 });
  };

  const toggleEnabled = () => {
    dispatch({ enabled: !store?.enabled });
  };

  useEffect(() => {
    return logger("POPUP");
  }, []);

  return (
    <div
      className={`popupContainer ${store?.enabled ? "enabled" : "disabled"}`}
    >
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
        className="blocking-switch"
        data-testid="blocking-switch"
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
        {`Blocking: ${Blocking[store.blocking]}`}
      </button>
    </div>
  );
}
