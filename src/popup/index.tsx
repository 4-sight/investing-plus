import React from "react";
import ReactDOM from "react-dom";
import Popup from "./Popup";
import { GenStoreStateProvider } from "./context/GenStoreContext";
import { BlackListStateProvider } from "./context/BlackListContext";
import { WhiteListStateProvider } from "./context/WhiteListContext";

import "./scss/index.scss";

chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
  ReactDOM.render(
    <GenStoreStateProvider>
      <BlackListStateProvider>
        <WhiteListStateProvider>
          <Popup />
        </WhiteListStateProvider>
      </BlackListStateProvider>
    </GenStoreStateProvider>,
    document.getElementById("popup")
  );
});
