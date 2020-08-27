Object.assign(global, require("jest-chrome"));
jest.mock("./src/popup/scss/colours.module.scss", () => ({
  black1: "black1",
  black2: "black2",
  black3: "black3",
  white1: "white1",
  white2: "white2",
  red1: "red1",
  green1: "green1",
  blue1: "blue1",
  blue2: "blue2",
  blue3: "blue3",
}));
