export function getProperties(element: { [x: string]: any }) {
  let key;
  Object.keys(element).forEach((_key) => {
    if (_key.includes("__reactInternalInstance")) {
      key = _key;
    }
  });

  if (key) {
    return element[key];
  }
}
