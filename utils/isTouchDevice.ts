import { isClient } from "./isClient";

let state: boolean;

export function isTouchDevice(): boolean {
  if (!isClient()) return false;

  if (state === undefined) {
    state =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator["msMaxTouchPoints" as unknown as "maxTouchPoints"] > 0;
  }

  return state;
}
