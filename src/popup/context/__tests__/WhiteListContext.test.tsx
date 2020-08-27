/**
 * @jest-environment jsdom
 */

import React from "react";
import Consumer, {
  consumerHelpers,
} from "../../../testHelpers/contextConsumer";
import { render, fireEvent } from "@testing-library/react";
import { chrome } from "jest-chrome";

import {
  WhiteListStateProvider,
  useWhiteListState,
  useWhiteListActions,
} from "../WhiteListContext";
import { EventMessage } from "../../../types";
import { defaults } from "../../../testHelpers";

describe("WhiteListContext", () => {
  // Setup

  beforeEach(() => {
    chrome.runtime.sendMessage.mockClear();
    chrome.runtime.onMessage.clearListeners();
  });
  //=========================================

  it("should call chrome.runtime.sendMessage with GET_WHITELIST and a callback", () => {
    expect.assertions(4);

    expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();
    render(
      <WhiteListStateProvider>
        <Consumer
          useContextState={useWhiteListState}
          useContextActions={useWhiteListActions}
        />
      </WhiteListStateProvider>
    );
    expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
    expect(chrome.runtime.sendMessage.mock.calls[0][0]).toEqual({
      type: EventMessage.GET_WHITELIST,
    });
    expect(chrome.runtime.sendMessage.mock.calls[0][1]).toBeInstanceOf(
      Function
    );
  });

  it("should add a listener to runtime.onMessage", () => {
    expect.assertions(2);

    expect(chrome.runtime.onMessage.hasListeners()).toBe(false);

    render(
      <WhiteListStateProvider>
        <Consumer
          useContextState={useWhiteListState}
          useContextActions={useWhiteListActions}
        />
      </WhiteListStateProvider>
    );

    expect(chrome.runtime.onMessage.hasListeners()).toBe(true);
  });

  it("should remove the listener on unmount", () => {
    expect.assertions(3);
    expect(chrome.runtime.onMessage.hasListeners()).toBe(false);

    const { unmount } = render(
      <WhiteListStateProvider>
        <Consumer
          useContextState={useWhiteListState}
          useContextActions={useWhiteListActions}
        />
      </WhiteListStateProvider>
    );

    expect(chrome.runtime.onMessage.hasListeners()).toBe(true);

    unmount();

    expect(chrome.runtime.onMessage.hasListeners()).toBe(false);
  });

  describe("useWhiteListState", () => {
    it("should return the current blackList users", () => {
      expect.assertions(defaults.userList().length);
      chrome.runtime.sendMessage.mockImplementationOnce((_, cb) => {
        cb(defaults.userList());
      });

      const { queryByText } = render(
        <WhiteListStateProvider>
          <Consumer
            useContextState={useWhiteListState}
            useContextActions={useWhiteListActions}
          />
        </WhiteListStateProvider>
      );

      expect(
        queryByText(
          `user_name:${defaults.userList()[0].name}, user_id:${
            defaults.userList()[0].id
          }`
        )
      ).toBeTruthy();
      expect(
        queryByText(
          `user_name:${defaults.userList()[1].name}, user_id:${
            defaults.userList()[1].id
          }`
        )
      ).toBeTruthy();
      expect(
        queryByText(
          `user_name:${defaults.userList()[2].name}, user_id:${
            defaults.userList()[2].id
          }`
        )
      ).toBeTruthy();
    });
  });

  describe("useWhiteListActions", () => {
    describe("add", () => {
      it("should call runtime.sendMessage: WHITELIST_ADD", () => {
        expect.assertions(5);
        const user1 = {
          name: "test-user-1",
          id: "555-1",
        };
        const user2 = {
          name: "test-user-2",
          id: "555-2",
        };
        const { getByTestId } = render(
          <WhiteListStateProvider>
            <Consumer
              useContextState={useWhiteListState}
              useContextActions={useWhiteListActions}
            />
          </WhiteListStateProvider>
        );
        chrome.runtime.sendMessage.mockClear();

        expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

        consumerHelpers.setArgs(user1);
        fireEvent.click(getByTestId("add"));

        expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
        expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
          type: EventMessage.WHITELIST_ADD,
          payload: user1,
        });

        consumerHelpers.setArgs(user2);
        fireEvent.click(getByTestId("add"));

        expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(2);
        expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
          type: EventMessage.WHITELIST_ADD,
          payload: user2,
        });
      });
    });

    describe("remove", () => {
      it("should call runtime.sendMessage: WHITELIST_REMOVE", () => {
        expect.assertions(5);
        const user1 = {
          name: "test-user-1",
          id: "555-1",
        };
        const user2 = {
          name: "test-user-2",
          id: "555-2",
        };
        const { getByTestId } = render(
          <WhiteListStateProvider>
            <Consumer
              useContextState={useWhiteListState}
              useContextActions={useWhiteListActions}
            />
          </WhiteListStateProvider>
        );
        chrome.runtime.sendMessage.mockClear();

        expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

        consumerHelpers.setArgs(user1);
        fireEvent.click(getByTestId("remove"));

        expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
        expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
          type: EventMessage.WHITELIST_REMOVE,
          payload: user1,
        });

        consumerHelpers.setArgs(user2);
        fireEvent.click(getByTestId("remove"));

        expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(2);
        expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
          type: EventMessage.WHITELIST_REMOVE,
          payload: user2,
        });
      });
    });

    describe("update", () => {
      it("should call runtime.sendMessage: WHITELIST_UPDATE_USER", () => {
        expect.assertions(5);
        const user1 = {
          name: "test-user-1",
          id: "555-1",
        };
        const update1 = {
          name: "update-name-1",
        };
        const user2 = {
          name: "test-user-2",
          id: "555-2",
        };
        const update2 = {
          name: "update-name-2",
        };
        const { getByTestId } = render(
          <WhiteListStateProvider>
            <Consumer
              useContextState={useWhiteListState}
              useContextActions={useWhiteListActions}
            />
          </WhiteListStateProvider>
        );
        chrome.runtime.sendMessage.mockClear();

        expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

        consumerHelpers.setArgs(user1, update1);
        fireEvent.click(getByTestId("update"));

        expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
        expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
          type: EventMessage.WHITELIST_UPDATE_USER,
          payload: { user: user1, update: update1 },
        });

        consumerHelpers.setArgs(user2, update2);
        fireEvent.click(getByTestId("update"));

        expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(2);
        expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
          type: EventMessage.WHITELIST_UPDATE_USER,
          payload: { user: user2, update: update2 },
        });
      });
    });

    describe("switchList", () => {
      it("should call runtime.sendMessage: WHITELIST_SWITCH_USER with payload: user ", () => {
        expect.assertions(5);
        const user1 = {
          name: "test-user-1",
          id: "555-1",
        };
        const user2 = {
          name: "test-user-2",
          id: "555-2",
        };
        const { getByTestId } = render(
          <WhiteListStateProvider>
            <Consumer
              useContextState={useWhiteListState}
              useContextActions={useWhiteListActions}
            />
          </WhiteListStateProvider>
        );
        chrome.runtime.sendMessage.mockClear();

        expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();

        consumerHelpers.setArgs(user1);
        fireEvent.click(getByTestId("switchList"));

        expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
        expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
          type: EventMessage.WHITELIST_SWITCH_USER,
          payload: user1,
        });

        consumerHelpers.setArgs(user2);
        fireEvent.click(getByTestId("switchList"));

        expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(2);
        expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
          type: EventMessage.WHITELIST_SWITCH_USER,
          payload: user2,
        });
      });
    });
  });
});
