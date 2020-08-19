import { addButtons, removeButtons, sectionClassName } from "..";
import { blackListUser, whiteListUser } from "../../utils";

jest.mock("../../utils/blackListUser", () => ({
  blackListUser: jest.fn(),
}));

jest.mock("../../utils/whiteListUser", () => ({
  whiteListUser: jest.fn(),
}));

const mockBlackListUser = (blackListUser as unknown) as jest.Mock;
const mockWhiteListUser = (whiteListUser as unknown) as jest.Mock;

const mockBlackListOnClick = jest.fn();
const mockWhiteListOnClick = jest.fn();

class MockDiv {
  children = [];
  className: string = "";

  append = jest.fn((...elements) => {
    elements.forEach((element) => {
      this.children.push(element);
    });
  });
}

class MockButton {
  onClick: (e: MouseEvent) => any = undefined;
  textContent: string = undefined;
}

class MockElement {
  parentNode = {
    removeChild: jest.fn(),
  };
}

const mockElement1 = new MockElement();
const mockElement2 = new MockElement();

const mockUserNameWrapper1 = {
  children: [],
  append: jest.fn((element) => {
    mockUserNameWrapper1.children.push(element);
  }),
};
const mockUserNameWrapper2 = {
  children: [],
  append: jest.fn((element) => {
    mockUserNameWrapper2.children.push(element);
  }),
};

const mockUserId1 = "test-user-id1";
const mockUserName1 = "test-username-1";
const mockUserId2 = "test-user-id1";
const mockUserName2 = "test-username-1";

const mockUserNameElement1 = {
  textContent: mockUserName1,
  parentNode: mockUserNameWrapper1,
};

const mockUserNameElement2 = {
  textContent: mockUserName2,
  parentNode: mockUserNameWrapper2,
};

const mockComment1 = {
  getElementsByClassName: jest.fn(() => [mockUserNameElement1]),
  attributes: {
    "data-user-id": { value: mockUserId1 },
  },
};
const mockComment2 = {
  getElementsByClassName: jest.fn(() => [mockUserNameElement2]),
  attributes: {
    "data-user-id": { value: mockUserId2 },
  },
};

const mockDoc = {
  getElementsByClassName: jest.fn((className: string) => {
    switch (className) {
      case "js-comment":
        return [mockComment1, mockComment2];

      case sectionClassName:
        return [mockElement1, mockElement2];
    }
  }),
  createElement: jest.fn((type: string) => {
    switch (type) {
      case "div":
        return new MockDiv();

      case "button":
        return new MockButton();
    }
  }),
};

global.document = mockDoc as any;

describe("addButtons", () => {
  // Setup

  beforeEach(() => {
    mockBlackListUser.mockClear();
    mockWhiteListUser.mockClear();
    mockDoc.createElement.mockClear();
    mockDoc.getElementsByClassName.mockClear();
    mockUserNameWrapper1.append.mockClear();
    mockUserNameWrapper2.append.mockClear();
    mockComment1.getElementsByClassName.mockClear();
    mockComment2.getElementsByClassName.mockClear();
    mockBlackListOnClick.mockClear();
    mockWhiteListOnClick.mockClear();
    mockBlackListUser.mockImplementation(() => mockBlackListOnClick);
    mockWhiteListUser.mockImplementation(() => mockWhiteListOnClick);
  });

  //===========================================

  it('should add a div with the correct class to every "js-comment" class element', () => {
    expect.assertions(8);

    expect(mockUserNameWrapper1.append).not.toHaveBeenCalled();
    expect(mockUserNameWrapper2.append).not.toHaveBeenCalled();

    addButtons();

    expect(mockUserNameWrapper1.append).toHaveBeenCalledTimes(1);
    expect(mockUserNameWrapper2.append).toHaveBeenCalledTimes(1);
    const div1 = mockUserNameWrapper1.children[0];
    const div2 = mockUserNameWrapper2.children[0];
    expect(div1).toBeInstanceOf(MockDiv);
    expect(div1.className).toEqual(sectionClassName);
    expect(div2).toBeInstanceOf(MockDiv);
    expect(div2.className).toEqual(sectionClassName);
  });

  it("should add two buttons to the div", () => {
    expect.assertions(3);

    addButtons();

    const div = mockUserNameWrapper1.children[0];
    expect(div.children.length).toEqual(2);
    expect(div.children[0]).toBeInstanceOf(MockButton);
    expect(div.children[1]).toBeInstanceOf(MockButton);
  });

  describe("blackList button", () => {
    it("should call blackListUser with a username and id, on creation", () => {
      expect.assertions(6);

      expect(mockBlackListUser).not.toHaveBeenCalled();

      addButtons();

      expect(mockBlackListUser).toHaveBeenCalledTimes(2);
      expect(mockBlackListUser.mock.calls[0][0]).toEqual(mockUserName1);
      expect(mockBlackListUser.mock.calls[0][1]).toEqual(mockUserId1);
      expect(mockBlackListUser.mock.calls[1][0]).toEqual(mockUserName2);
      expect(mockBlackListUser.mock.calls[1][1]).toEqual(mockUserId2);
    });

    it("should call blackListUser onclick", () => {
      expect.assertions(3);

      expect(mockBlackListOnClick).not.toHaveBeenCalled();
      const blackListButton = mockUserNameWrapper1.children[0].children[0];

      expect(mockBlackListOnClick).not.toHaveBeenCalled();

      blackListButton.onclick();

      expect(mockBlackListOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("whiteList button", () => {
    it("should call whiteListUser with a username and id, on creation", () => {
      expect.assertions(6);

      expect(mockWhiteListUser).not.toHaveBeenCalled();

      addButtons();

      expect(mockWhiteListUser).toHaveBeenCalledTimes(2);
      expect(mockWhiteListUser.mock.calls[0][0]).toEqual(mockUserName1);
      expect(mockWhiteListUser.mock.calls[0][1]).toEqual(mockUserId1);
      expect(mockWhiteListUser.mock.calls[1][0]).toEqual(mockUserName2);
      expect(mockWhiteListUser.mock.calls[1][1]).toEqual(mockUserId2);
    });

    it("should call whiteListUser onclick", () => {
      expect.assertions(3);

      expect(mockWhiteListOnClick).not.toHaveBeenCalled();
      const whiteListButton = mockUserNameWrapper1.children[0].children[1];

      expect(mockWhiteListOnClick).not.toHaveBeenCalled();

      whiteListButton.onclick();

      expect(mockWhiteListOnClick).toHaveBeenCalledTimes(1);
    });
  });
});

describe("removeButtons", () => {
  // Setup

  beforeEach(() => {
    mockElement1.parentNode.removeChild.mockClear();
    mockElement2.parentNode.removeChild.mockClear();
    mockDoc.getElementsByClassName.mockClear();
  });

  //========================================
  it("should call document.getElementsByClassName with the correct class name", () => {
    expect.assertions(3);

    expect(mockDoc.getElementsByClassName).not.toHaveBeenCalled();

    removeButtons();

    expect(mockDoc.getElementsByClassName).toHaveBeenCalledTimes(1);
    expect(mockDoc.getElementsByClassName).toHaveBeenCalledWith(
      sectionClassName
    );
  });

  it("should call parentNode.removeChild with the element, for each returned element", () => {
    expect.assertions(6);

    expect(mockElement1.parentNode.removeChild).not.toHaveBeenCalled();
    expect(mockElement2.parentNode.removeChild).not.toHaveBeenCalled();

    removeButtons();

    expect(mockElement1.parentNode.removeChild).toHaveBeenCalledTimes(1);
    expect(mockElement1.parentNode.removeChild).toHaveBeenCalledWith(
      mockElement1
    );
    expect(mockElement2.parentNode.removeChild).toHaveBeenCalledTimes(1);
    expect(mockElement2.parentNode.removeChild).toHaveBeenCalledWith(
      mockElement2
    );
  });
});
