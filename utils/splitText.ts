export type SplitTextConfig = {
  wordSpanAttrs?: Record<string, string>;
  lineSpanAttrs?: Record<string, string>;
  wrapLines?: boolean;
};
class SplitText {
  static instances = new Map<HTMLElement, SplitText>();

  static split(element: HTMLElement, config: SplitTextConfig = {}): void {
    return void new SplitText(element, config);
  }

  text?: string;
  words: HTMLSpanElement[] = [];
  lines: HTMLSpanElement[] = [];

  private containerWidth = this.element.parentElement?.offsetWidth;
  private config: SplitTextConfig = {
    wordSpanAttrs: {},
    lineSpanAttrs: {},
    wrapLines: true,
  };

  private resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { inlineSize }: ResizeObserverSize = Array.isArray(
        entry.contentBoxSize
      )
        ? entry.contentBoxSize[0]
        : entry.contentBoxSize;

      if (inlineSize === this.containerWidth) return;
      this.containerWidth = inlineSize;
      this.handleResize();
    }
  });

  constructor(private element: HTMLElement, config: SplitTextConfig = {}) {
    if (SplitText.instances.has(element)) {
      return SplitText.instances.get(element)!;
    }

    Object.assign(this.config, config);
    SplitText.instances.set(element, this);
    this.split();
  }

  private split() {
    const fragment = document.createDocumentFragment();
    const textNode = this.element.firstChild;

    if (!(textNode instanceof Text)) return;

    this.text = textNode.nodeValue ?? "";
    this.resizeObserver.unobserve(this.element);

    {
      this.words = this.text.split(" ").map((word) => {
        const span = document.createElement("span");
        Object.entries(this.config.wordSpanAttrs!).forEach(([k, v]) =>
          span.setAttribute(k, v)
        );
        span.innerText = word + " ";
        return span;
      });

      fragment.append(...this.words);
      this.element.replaceChildren(fragment);
    }

    if (this.config.wrapLines) {
      let y: number | undefined;
      const _lines: HTMLSpanElement[][] = [];

      this.words.forEach((span) => {
        if (span.offsetTop === y) {
          return _lines[_lines.length - 1].push(span);
        }
        y = span.offsetTop;
        _lines.push([span]);
      });

      this.lines = _lines.map((line) => {
        const span = document.createElement("span");
        Object.entries(this.config.lineSpanAttrs!).forEach(([k, v]) =>
          span.setAttribute(k, v)
        );
        span.append(...line);
        return span;
      });

      fragment.replaceChildren(...this.lines);
      this.element.replaceChildren(fragment);
    }

    this.resizeObserver.observe(this.element.parentElement || document.body);
  }

  private handleResize = (): void => {
    if (this.containerWidth === window.innerWidth) return;
    this.containerWidth = window.innerWidth;
    this.reset();
    this.split();
  };

  reset() {
    this.element.innerText = this.text ?? this.element.innerText;
  }

  destroy(doReset = true) {
    if (doReset) this.reset();
    SplitText.instances.delete(this.element);
  }
}

export { SplitText };
