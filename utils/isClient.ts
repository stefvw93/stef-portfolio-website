let state: boolean;

export function isClient(): boolean {
  if (state === undefined) {
    state = globalThis.constructor.name === "Window";
  }

  return state;
}
