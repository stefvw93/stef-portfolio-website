const splitElements = new WeakSet<HTMLElement>();

export function createSplitText(
  element: HTMLElement,
  config: {
    wordSpanAttrs?: Record<string, string>;
    lineSpanAttrs?: Record<string, string>;
    wrapLines?: boolean;
  } = {}
) {
  const { wordSpanAttrs = {}, lineSpanAttrs = {}, wrapLines = true } = config;
  let textNode: ChildNode | null;
  let text: string | undefined;
  let fragment: DocumentFragment;
  let words: HTMLSpanElement[] = [];
  let lines: HTMLSpanElement[] = [];

  function reset() {
    splitElements.delete(element);
    if (text == undefined) return;
    element.innerText = text;
  }

  function split() {
    if (splitElements.has(element)) return;

    textNode = element.firstChild;
    text = (textNode instanceof Text ? textNode.nodeValue : "") ?? "";
    fragment = document.createDocumentFragment();

    words = text.split(" ").map((word) => {
      const span = document.createElement("span");
      Object.entries(wordSpanAttrs).forEach(([k, v]) =>
        span.setAttribute(k, v)
      );
      span.innerText = word + " ";
      return span;
    });

    fragment.replaceChildren(...words);
    element.replaceChildren(fragment);
    splitElements.add(element);

    getLines();
  }

  function getLines() {
    let y: number | undefined;
    const _lines: HTMLSpanElement[][] = [];

    words.forEach((span) => {
      if (span.offsetTop === y) {
        return _lines[_lines.length - 1].push(span);
      }
      y = span.offsetTop;
      _lines.push([span]);
    });

    if (wrapLines) {
      lines = _lines.map((line) => {
        const span = document.createElement("span");
        Object.entries(lineSpanAttrs).forEach(([k, v]) =>
          span.setAttribute(k, v)
        );
        span.append(...line);
        return span;
      });

      fragment.replaceChildren(...lines);
      element.replaceChildren(fragment);
      splitElements.add(element);
    }
  }

  function handleResize() {
    reset();
    split();
  }

  function init() {
    split();
    window.addEventListener("resize", handleResize);
  }

  init();

  return { text, words, lines, split, reset };
}
