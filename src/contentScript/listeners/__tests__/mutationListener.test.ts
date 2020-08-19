import {
  mutationListener,
  addMutationListener,
  removeMutationListeners,
} from "..";
import { addButtons } from "../../utils";

jest.mock("../../utils/handleButtons", () => ({
  addButtons: jest.fn(),
  removeButtons: jest.fn(),
  sectionClassName: "test",
}));

const mockAddButtons = (addButtons as unknown) as jest.Mock;

class MockObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  takeRecords = jest.fn();
}

const MockMutationObserver = jest
  .fn()
  .mockImplementation(() => new MockObserver());

class MockMutationRecord {
  type: string = "childList";
  item: any = jest.fn();
  private collection: Element[];
  addedNodes = {
    forEach: (cb: (element: any) => void) => {
      return this.collection.forEach(cb);
    },
  };
  constructor(...elements: Element[]) {
    this.collection = elements;
  }
}

class mockElement {
  private list: string[] = [];
  classList: {
    add: (item: string) => void;
    contains: (item: string) => boolean;
  };

  constructor() {
    this.classList = {
      add: this.classListAdd,
      contains: this.classListContains,
    };
  }

  private classListAdd = (item: string) => {
    this.list.push(item);
  };
  private classListContains = (item: string) => {
    return this.list.includes(item);
  };
}

const mockCommentWrapper = "test-wrapper";
const mockDoc = {
  getElementsByClassName: jest.fn(() => [mockCommentWrapper]),
};

global.document = mockDoc as any;
global.MutationObserver = MockMutationObserver;
global.Element = mockElement as any;

describe("mutationListener", () => {
  // Setup
  beforeEach(() => {
    mockAddButtons.mockClear();
  });
  //==========================================

  it('should call addButtons with an array of each "js-comment" class element in the given MutationRecord', () => {
    expect.assertions(3);

    const element1 = new Element();
    element1.classList.add("js-comment");
    const element2 = new Element();
    element2.classList.add("js-comment");
    const element3 = new Element();

    const mutationRecord: MutationRecord = new MockMutationRecord(
      element1,
      element2,
      element3
    ) as any;

    expect(mockAddButtons).not.toHaveBeenCalled();
    mutationListener([mutationRecord], new MockMutationObserver());
    expect(mockAddButtons).toHaveBeenCalledTimes(1);
    expect(mockAddButtons).toHaveBeenCalledWith([element1, element2]);
  });

  it('should not call addButtons if there are no "js-comment" class elements in the given MutationRecord', () => {
    expect.assertions(2);

    const mutationRecord1: MutationRecord = new MockMutationRecord() as any;

    expect(mockAddButtons).not.toHaveBeenCalled();
    mutationListener([mutationRecord1], new MockMutationObserver());
    expect(mockAddButtons).not.toHaveBeenCalled();
  });
});

describe("addMutationListener", () => {
  // Setup
  beforeEach(() => {
    MockMutationObserver.mockClear();
  });
  //===============================================

  it("should create a MutationObserver", () => {
    expect.assertions(2);

    expect(MockMutationObserver).not.toHaveBeenCalled();

    addMutationListener();

    expect(MockMutationObserver).toHaveBeenCalledTimes(1);
  });

  it("should add an observer to the observerList", () => {
    expect.assertions(2);

    const observerList = [];

    addMutationListener(observerList);

    expect(observerList.length).toEqual(1);
    expect(observerList[0]).toBeInstanceOf(MockObserver);
  });

  it('should call observer.observe with the "js-comments-wrapper"', () => {
    expect.assertions(3);

    const mockObserver = new MockObserver();
    MockMutationObserver.mockReturnValueOnce(mockObserver);
    const observerList = [];

    expect(mockObserver.observe).not.toHaveBeenCalled();

    addMutationListener(observerList);

    expect(mockObserver.observe).toHaveBeenCalledTimes(1);
    expect(mockObserver.observe.mock.calls[0][0]).toEqual(mockCommentWrapper);
  });
});

//======================================

describe("removeMutationListener", () => {
  it("should call disconnect for each observer in the observerList", () => {
    expect.assertions(4);

    const mockObserver1 = new MockObserver();
    const mockObserver2 = new MockObserver();
    const observerList = [mockObserver1, mockObserver2];

    expect(mockObserver1.disconnect).not.toHaveBeenCalled();
    expect(mockObserver2.disconnect).not.toHaveBeenCalled();

    removeMutationListeners(observerList);

    expect(mockObserver1.disconnect).toHaveBeenCalledTimes(1);
    expect(mockObserver2.disconnect).toHaveBeenCalledTimes(1);
  });

  it("should empty the observerList", () => {
    expect.assertions(2);

    const mockObserver1 = new MockObserver();
    const mockObserver2 = new MockObserver();
    const observerList = [mockObserver1, mockObserver2];

    expect(observerList.length).toEqual(2);

    removeMutationListeners(observerList);

    expect(observerList.length).toEqual(0);
  });
});
