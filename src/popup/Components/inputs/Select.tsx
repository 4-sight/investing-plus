import React, { useState } from "react";
import ChevronUp from "../../icons/ChevronUp";
import ChevronDown from "../../icons/ChevronDown";

interface Props {
  options: string[];
  title?: string;
  status: string;
  testId: string;
  action: (option: string) => void;
}

export default function Select({
  status,
  options,
  action,
  testId,
  title,
}: Props) {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  return (
    <div className="select-input" data-testId={testId}>
      <div
        className="select-status-display"
        title={title}
        onClick={(e) => {
          e.preventDefault();
          setShowDropDown(!showDropDown);
        }}
      >
        <div className="select-status">{status}</div>
        <div className="drop-down-indicator">
          {showDropDown ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>
      {showDropDown && (
        <div className="drop-down">
          <ul className="select-options">
            {options.map((option) => (
              <li
                className="select-option"
                onClick={(e) => {
                  e.preventDefault();
                  action(option);
                  setShowDropDown(false);
                }}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
