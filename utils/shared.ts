import { isTouchDevice } from "./isTouchDevice";

export const SCROLL_TRIGGER_START_DEFAULT = isTouchDevice()
  ? "top 90%"
  : "top 75%";
