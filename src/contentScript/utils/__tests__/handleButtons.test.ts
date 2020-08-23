import { addButtons, removeButtons, sectionClassName } from "..";
import {
  blackListAdd,
  blackListRemove,
  whiteListAdd,
  whiteListRemove,
} from "../../utils";

jest.mock("../../utils/blackList", () => ({
  blackListAdd: jest.fn(),
  blackListRemove: jest.fn(),
}));

jest.mock("../../utils/whiteList", () => ({
  whiteListAdd: jest.fn(),
  whiteListRemove: jest.fn(),
}));

const mockBlackListAdd = (blackListAdd as unknown) as jest.Mock;
const mockBlackListRemove = (blackListRemove as unknown) as jest.Mock;
const mockWhiteListAdd = (whiteListAdd as unknown) as jest.Mock;
const mockWhiteListRemove = (whiteListRemove as unknown) as jest.Mock;

const mockBlackListAddOnClick = jest.fn();
const mockBlackListRemoveOnClick = jest.fn();
const mockWhiteListAddOnClick = jest.fn();
const mockWhiteListRemoveOnClick = jest.fn();

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
  setAttribute = jest.fn();
  innerHTML = "";
  style = {};
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
    mockBlackListAdd.mockClear();
    mockBlackListRemove.mockClear();
    mockWhiteListAdd.mockClear();
    mockWhiteListRemove.mockClear();
    mockDoc.createElement.mockClear();
    mockDoc.getElementsByClassName.mockClear();
    mockUserNameWrapper1.append.mockClear();
    mockUserNameWrapper2.append.mockClear();
    mockComment1.getElementsByClassName.mockClear();
    mockComment2.getElementsByClassName.mockClear();
    mockBlackListAddOnClick.mockClear();
    mockBlackListRemoveOnClick.mockClear();
    mockWhiteListAddOnClick.mockClear();
    mockWhiteListRemoveOnClick.mockClear();
    mockBlackListAdd.mockImplementation(() => mockBlackListAddOnClick);
    mockBlackListRemove.mockImplementation(() => mockBlackListRemoveOnClick);
    mockWhiteListAdd.mockImplementation(() => mockWhiteListAddOnClick);
    mockWhiteListRemove.mockImplementation(() => mockWhiteListRemoveOnClick);
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

  it("should add four buttons to the div", () => {
    expect.assertions(5);

    addButtons();

    const div = mockUserNameWrapper1.children[0];
    expect(div.children.length).toEqual(4);
    expect(div.children[0]).toBeInstanceOf(MockButton);
    expect(div.children[1]).toBeInstanceOf(MockButton);
    expect(div.children[2]).toBeInstanceOf(MockButton);
    expect(div.children[3]).toBeInstanceOf(MockButton);
  });

  describe("blackListAdd button", () => {
    it("should call blackListAdd with a username and id, on creation", () => {
      expect.assertions(6);

      expect(mockBlackListAdd).not.toHaveBeenCalled();

      addButtons();

      expect(mockBlackListAdd).toHaveBeenCalledTimes(2);
      expect(mockBlackListAdd.mock.calls[0][0]).toEqual(mockUserName1);
      expect(mockBlackListAdd.mock.calls[0][1]).toEqual(mockUserId1);
      expect(mockBlackListAdd.mock.calls[1][0]).toEqual(mockUserName2);
      expect(mockBlackListAdd.mock.calls[1][1]).toEqual(mockUserId2);
    });

    it("should call blackListAdd onclick", () => {
      expect.assertions(3);

      expect(mockBlackListAddOnClick).not.toHaveBeenCalled();
      const blackListButton = mockUserNameWrapper1.children[0].children[0];

      expect(mockBlackListAddOnClick).not.toHaveBeenCalled();

      blackListButton.onclick();

      expect(mockBlackListAddOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("blackListRemove button", () => {
    it("should call blackListRemove with a username and id, on creation", () => {
      expect.assertions(6);

      expect(mockBlackListRemove).not.toHaveBeenCalled();

      addButtons();

      expect(mockBlackListRemove).toHaveBeenCalledTimes(2);
      expect(mockBlackListRemove.mock.calls[0][0]).toEqual(mockUserName1);
      expect(mockBlackListRemove.mock.calls[0][1]).toEqual(mockUserId1);
      expect(mockBlackListRemove.mock.calls[1][0]).toEqual(mockUserName2);
      expect(mockBlackListRemove.mock.calls[1][1]).toEqual(mockUserId2);
    });

    it("should call blackListRemove onclick", () => {
      expect.assertions(3);

      expect(mockBlackListRemoveOnClick).not.toHaveBeenCalled();
      const blackListRemoveButton =
        mockUserNameWrapper1.children[0].children[1];

      expect(mockBlackListRemoveOnClick).not.toHaveBeenCalled();

      blackListRemoveButton.onclick();

      expect(mockBlackListRemoveOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("whiteListAdd button", () => {
    it("should call whiteListAdd with a username and id, on creation", () => {
      expect.assertions(6);

      expect(mockWhiteListAdd).not.toHaveBeenCalled();

      addButtons();

      expect(mockWhiteListAdd).toHaveBeenCalledTimes(2);
      expect(mockWhiteListAdd.mock.calls[0][0]).toEqual(mockUserName1);
      expect(mockWhiteListAdd.mock.calls[0][1]).toEqual(mockUserId1);
      expect(mockWhiteListAdd.mock.calls[1][0]).toEqual(mockUserName2);
      expect(mockWhiteListAdd.mock.calls[1][1]).toEqual(mockUserId2);
    });

    it("should call whiteListAdd onclick", () => {
      expect.assertions(3);

      expect(mockWhiteListAddOnClick).not.toHaveBeenCalled();
      const whiteListButton = mockUserNameWrapper1.children[0].children[2];

      expect(mockWhiteListAddOnClick).not.toHaveBeenCalled();

      whiteListButton.onclick();

      expect(mockWhiteListAddOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("whiteListRemove button", () => {
    it("should call whiteListRemove with a username and id, on creation", () => {
      expect.assertions(6);

      expect(mockWhiteListRemove).not.toHaveBeenCalled();

      addButtons();

      expect(mockWhiteListRemove).toHaveBeenCalledTimes(2);
      expect(mockWhiteListRemove.mock.calls[0][0]).toEqual(mockUserName1);
      expect(mockWhiteListRemove.mock.calls[0][1]).toEqual(mockUserId1);
      expect(mockWhiteListRemove.mock.calls[1][0]).toEqual(mockUserName2);
      expect(mockWhiteListRemove.mock.calls[1][1]).toEqual(mockUserId2);
    });

    it("should call whiteListRemove onclick", () => {
      expect.assertions(3);

      expect(mockWhiteListRemoveOnClick).not.toHaveBeenCalled();
      const whiteListButton = mockUserNameWrapper1.children[0].children[3];

      expect(mockWhiteListRemoveOnClick).not.toHaveBeenCalled();

      whiteListButton.onclick();

      expect(mockWhiteListRemoveOnClick).toHaveBeenCalledTimes(1);
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
