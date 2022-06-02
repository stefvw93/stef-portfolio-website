export const isClient = () => globalThis.constructor.name === "Window";
