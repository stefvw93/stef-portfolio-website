let state: boolean;

export function isTouchDevice() {
  if (!state) {
    state =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator["msMaxTouchPoints" as unknown as "maxTouchPoints"] > 0;
  }

  return state;
}
