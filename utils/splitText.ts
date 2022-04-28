const splitElements = new WeakSet<HTMLElement>();

export type SplitTextConfig = {
  wordSpanAttrs?: Record<string, string>;
  lineSpanAttrs?: Record<string, string>;
  wrapLines?: boolean;
};

export class SplitText {
  static instances = new WeakMap<HTMLElement, SplitText>();
  static split(element: HTMLElement, config: SplitTextConfig = {}): void {
    return void new SplitText(element, config);
  }

  private config: SplitTextConfig = {
    wordSpanAttrs: {},
    lineSpanAttrs: {},
    wrapLines: true,
  };

  text?: string;
  words: HTMLSpanElement[] = [];
  lines: HTMLSpanElement[] = [];

  constructor(private element: HTMLElement, config: SplitTextConfig = {}) {
    if (SplitText.instances.has(element)) {
      return SplitText.instances.get(element)!;
    }

    Object.assign(this.config, config);

    this.init();
    // window.addEventListener("resize", this.handleResize);
    SplitText.instances.set(element, this);
  }

  private init() {
    const fragment = document.createDocumentFragment();
    const textNode = this.element.firstChild;
    this.text =
      this.text ?? (textNode instanceof Text ? textNode.nodeValue : "") ?? "";

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
  }

  private handleResize = (): void => {
    this.reset();
    this.init();
  };

  reset() {
    this.element.innerText = this.text ?? this.element.innerText;
  }

  destroy(doReset = true) {
    if (doReset) this.reset();
    // window.removeEventListener("resize", this.handleResize);
    SplitText.instances.delete(this.element);
  }
}
