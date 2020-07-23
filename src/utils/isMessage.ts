export const isMessage = (message): boolean => {
  if (
    typeof message === "object" &&
    !Array.isArray(message) &&
    "type" in message
  ) {
    return true;
  }

  return false;
};
