import React, { Fragment } from "react";

interface Props {
  useContextState: () => any;
  useContextActions: () => any;
}

let args = [];

const setArgs = (..._args) => {
  args = _args;
};

const getArgs = () => args;

const clearArgs = () => {
  args.length = 0;
};

export const consumerHelpers = {
  setArgs,
  getArgs,
  clearArgs,
};

export default ({ useContextState, useContextActions }: Props) => {
  const state = useContextState();
  const actions = useContextActions();

  const mapStateToList = () => {
    if (Array.isArray(state)) {
      return (
        <ul>
          {state.map((user, i) => (
            <li key={i}>{`user_name:${user.name}, user_id:${user.id}`}</li>
          ))}
        </ul>
      );
    } else {
      return (
        <ul>
          {Object.keys(state).map((prop, i) => (
            <li key={i}>{`${prop}:${state[prop]}`}</li>
          ))}
        </ul>
      );
    }
  };

  const mapActionsToButtons = () => (
    <Fragment>
      {Object.keys(actions).map((action, i) => {
        return (
          <button
            data-testid={action}
            key={i}
            onClick={() => {
              actions[action](...getArgs());
            }}
          >
            {action}
          </button>
        );
      })}
    </Fragment>
  );

  return (
    <div>
      {mapStateToList()}
      {mapActionsToButtons()}
    </div>
  );
};
