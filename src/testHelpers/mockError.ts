/* istanbul ignore file */

const _warn = console.warn;
const _error = console.error;

export const mockWarn = {
  mock: () => {
    console.warn = jest.fn();
  },
  restore: () => {
    console.warn = _warn;
  },
};

// =========================================

export const mockError = {
  mock: () => {
    console.error = jest.fn();
  },
  restore: () => {
    console.error = _error;
  },
};

// ========================================
