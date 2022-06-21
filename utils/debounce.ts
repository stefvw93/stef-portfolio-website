export function debounce<Fn extends Function>(
  this: unknown,
  fn: Fn,
  delay = 300
) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}
