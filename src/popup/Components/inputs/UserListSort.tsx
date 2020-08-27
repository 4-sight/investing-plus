import React from "react";
import Select from "./Select";

interface Props {
  label: string;
  status: any;
  options: any[];
  action: (option: any) => void;
}

export default function UserListSort({
  label,
  status,
  options,
  action,
}: Props) {
  return (
    <div className="user-list-sort">
      <label className="sort-label">{label}</label>
      <Select
        options={options}
        testId="sort-select"
        status={status}
        action={action}
      />
    </div>
  );
}
