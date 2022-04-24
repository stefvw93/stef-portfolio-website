/**
 * Join all input by spaces, skipping any undefined/nullish values.
 * @param input
 * @returns
 */
export function cleanJoin(...input: any[]): string {
  return input.filter((e) => e != undefined).join(" ");
}
