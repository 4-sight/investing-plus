import React from "react";

interface Props {
  Icon: React.FC;
  title: string;
  className: string;
  action: (e: React.MouseEvent) => void;
}

export default function UserListAction({
  Icon,
  title,
  className,
  action,
}: Props) {
  return (
    <button
      className={"user-list-action-button " + className}
      title={title}
      onClick={action}
    >
      <Icon />
    </button>
  );
}
