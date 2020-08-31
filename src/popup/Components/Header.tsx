import React from "react";
import PowerButton from "./inputs/PowerButton";

interface Props {
  enabled: boolean;
  toggleEnabled: () => void;
}

export default function Header({ enabled, toggleEnabled }: Props) {
  return (
    <header className="popup-header">
      <h1 style={{ fontWeight: 200 }}>
        Investing<b>Plus</b>
      </h1>
      <PowerButton {...{ enabled, toggleEnabled }} />
    </header>
  );
}
