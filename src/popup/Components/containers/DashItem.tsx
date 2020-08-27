import React from "react";
import Slider from "../inputs/Slider";
import Select from "../inputs/Select";

export enum UIType {
  Slider,
  Select,
}

interface Props {
  label: string;
  testId: string;
  action: (option?: any) => void;
  status?: string;
  value?: boolean;
  uiType: UIType;
  title?: string;
  enabled?: boolean;
  options?: string[];
}

export const handleUI = (ui: UIType, props: any) => {
  switch (ui) {
    case UIType.Slider:
      return <Slider {...props} />;
    case UIType.Select:
      return <Select {...props} />;
  }
};

export default function DashItem({
  label,
  testId,
  action,
  status,
  value = false,
  uiType,
  title,
  enabled = true,
  options,
}: Props) {
  return (
    <div className="dash-item">
      <div className="data-block">
        <label>{label}</label>
        {uiType !== UIType.Select && status && (
          <div className="status">{status}</div>
        )}
      </div>
      {enabled && (
        <div className="ui-block">
          {handleUI(uiType, { action, testId, value, title, options, status })}
        </div>
      )}
    </div>
  );
}
