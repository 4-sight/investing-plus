import colors from "../popup/scss/colours.module.scss";

export default `
.i-plus-block-buttons {
  margin-left: 1rem;
}

.i-plus-list-button {
  display: inline-block;
  border: none;
  padding: 0;
  margin: 0 0.3rem;
  text-decoration: none;
  background: transparent;
  color: #ffffff;
  font-family: sans-serif;
  font-size: 1rem;
  cursor: pointer;
  text-align: center;
  transition: background 250ms ease-in-out, 
              transform 150ms ease;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.commentUsername {
  display: flex;
  align-items: flex-start;
}

.black-list-add {
  color: ${colors.red1};
}

.black-list-remove {
  color: ${colors.green1};
  display: none;
}

.white-list-add {
  color: ${colors.blue1};
}

.white-list-remove {
  color: ${colors.black3};
  display: none
}
`;
