import React from "react";

interface Props {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  testId?: string;
}

export default function UserListSearch({
  label,
  onChange,
  className,
  testId,
}: Props) {
  return (
    <div className="user-list-search">
      <label className="search-label">{label}</label>
      <input
        className={"search-box " + className}
        data-testid={testId}
        type="text"
        placeholder="Search"
        onChange={onChange}
      />
    </div>
  );
}
