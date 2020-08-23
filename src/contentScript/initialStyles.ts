export default `
.i-plus-list-button {
  display: inline-block;
  border: none;
  padding: 0;
  margin: 0.5rem;
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

.black-list-add {
  color: red
}

.black-list-remove {
  color: green;
  display: none;
}

.white-list-add {
  color: blue
}

.white-list-remove {
  color: #333;
  display: none
}
`;
