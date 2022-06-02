import { isClient } from "./isClient";

let computedStyle: CSSStyleDeclaration;

export function getCssVar(name: string) {
  computedStyle ??= getComputedStyle(document.documentElement);
  return computedStyle.getPropertyValue(name).trim();
}
