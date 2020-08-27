import React from "react";
import PowerOff from "../../icons/PowerOff";

interface Props {
  enabled: boolean;
  toggleEnabled: () => void;
}

export default function PowerButton({ enabled, toggleEnabled }: Props) {
  return (
    <div className="power-button-wrapper">
      <button
        title={enabled ? "Disable Extension" : "Enable Extension"}
        id="power-button"
        className={enabled ? "enabled" : "disabled"}
        onClick={(e) => {
          e.preventDefault();
          toggleEnabled();
        }}
      >
        <PowerOff />
      </button>
    </div>
  );
}
