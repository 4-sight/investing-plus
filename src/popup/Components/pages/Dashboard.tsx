import React, { Fragment } from "react";
import { Blocking } from "../../../types";
import DashItem, { UIType } from "../containers/DashItem";
import {
  useGenStoreActions,
  useGenStoreState,
} from "../../context/GenStoreContext";

export type BlockingMode = "Off" | "Hide Blocked" | "Show Only Favourite";

const blockingOptions: BlockingMode[] = [
  "Off",
  "Hide Blocked",
  "Show Only Favourite",
];

export const getBlockingStatus = (blocking: Blocking): BlockingMode => {
  switch (blocking) {
    case Blocking.NONE:
      return "Off";

    case Blocking.BLACKLIST:
      return "Hide Blocked";

    case Blocking.WHITELIST:
      return "Show Only Favourite";
  }
};

export default function Dashboard() {
  const {
    blocking,
    highlightBlocked,
    highlightFavourite,
    enabled,
  } = useGenStoreState();
  const {
    toggleHighlightBlocked,
    toggleHighlightFavourite,
    setBlocking,
  } = useGenStoreActions();

  return (
    <div className="dashboard">
      {enabled ? (
        <Fragment>
          <DashItem
            label="Blocking Mode:"
            status={getBlockingStatus(blocking)}
            action={setBlocking}
            testId="switch-blocking"
            uiType={UIType.Select}
            title="Switch Blocking Mode"
            options={blockingOptions}
          />
          <DashItem
            label="Highlight Blocked Users:"
            status={
              blocking === Blocking.NONE
                ? highlightBlocked
                  ? "ON"
                  : "OFF"
                : "OFF"
            }
            action={toggleHighlightBlocked}
            testId="toggle-highlight-blocked"
            uiType={UIType.Slider}
            value={highlightBlocked}
            title={
              highlightBlocked
                ? "Turn highlighting off"
                : "Turn highlighting on"
            }
            enabled={blocking === Blocking.NONE}
          />
          <DashItem
            label="Highlight Favourite Users:"
            status={
              blocking !== Blocking.WHITELIST
                ? highlightFavourite
                  ? "ON"
                  : "OFF"
                : "OFF"
            }
            action={toggleHighlightFavourite}
            testId="toggle-highlight-favourite"
            uiType={UIType.Slider}
            value={highlightFavourite}
            title={
              highlightFavourite
                ? "Turn highlighting off"
                : "Turn highlighting on"
            }
            enabled={blocking !== Blocking.WHITELIST}
          />
        </Fragment>
      ) : (
        <h2>Investing Plus Disabled</h2>
      )}
    </div>
  );
}
