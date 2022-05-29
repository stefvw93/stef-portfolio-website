export function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator["msMaxTouchPoints" as unknown as "maxTouchPoints"] > 0
  );
}
