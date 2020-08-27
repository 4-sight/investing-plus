import React from "react";

interface Props {
  action: () => void;
  testId: string;
  value: boolean;
  title?: string;
}

export default function Slider({ action, testId, value, title }: Props) {
  return (
    <button
      className={`slider ${value ? "slider-on" : "slider-off"}`}
      data-testid={testId}
      onClick={(e) => {
        e.preventDefault();
        action();
      }}
      title={title}
    >
      <div className="slider-indicator" />
    </button>
  );
}
