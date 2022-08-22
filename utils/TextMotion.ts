import gsap from "gsap";
import { nextAnimationFrame } from "./nextAnimationFrame";

type SpanProcessor = (element: HTMLSpanElement) => void;
export type TextMotionParams = {
  wrapLines?: boolean;
  wrapChars?: boolean;
  processWord?: SpanProcessor;
  processChar?: SpanProcessor;
  processLine?: SpanProcessor;
};

export class TextMotion {
  static instances = new WeakMap<HTMLElement, TextMotion>();

  private readonly doWrapLines: boolean;
  private readonly doWrapChars: boolean;
  private chars: HTMLSpanElement[] = [];
  private words: HTMLSpanElement[] = [];
  private lines: HTMLSpanElement[] = [];
  private processWord: SpanProcessor;
  private processChar: SpanProcessor;
  private processLine: SpanProcessor;
  private resizeTimeout?: ReturnType<typeof setTimeout>;
  private setup: gsap.core.Tween[] = [];

  constructor(
    public readonly element: HTMLElement,
    params: TextMotionParams = {}
  ) {
    this.doWrapChars = params.wrapChars ?? false;
    this.doWrapLines = params.wrapLines ?? false;
    this.processWord = params.processWord ?? ((e: HTMLSpanElement) => e);
    this.processChar = params.processChar ?? ((e: HTMLSpanElement) => e);
    this.processLine = params.processLine ?? ((e: HTMLSpanElement) => e);

    if (TextMotion.instances.has(element)) {
      // throw new Error("Element is already processed.");
      return TextMotion.instances.get(element)!;
    }

    TextMotion.instances.set(element, this);
    this.wrap();
  }

  async getChars() {
    await nextAnimationFrame();
    return this.chars;
  }

  async getWords() {
    await nextAnimationFrame();
    return this.words;
  }

  async getLines() {
    await nextAnimationFrame();
    return this.lines;
  }

  private wrap() {
    this.wrapWords();
    if (this.doWrapLines) this.wrapLines();
  }

  private wrapWords() {
    const fragment = document.createDocumentFragment();
    const text = this.getTextContent(this.element);
    const words = text.split(" ").map((word) => {
      const span = document.createElement("span");
      span.innerText = `${word} `;
      if (this.doWrapChars) this.wrapChars(span);
      this.processWord(span);
      return span;
    });

    fragment.append(...words);
    this.element.replaceChildren(fragment);
    this.words = words;
  }

  private wrapChars(element: HTMLSpanElement) {
    const fragment = document.createDocumentFragment();
    const text = this.getTextContent(element);

    const chars = Array.from(text).map((char) => {
      const span = document.createElement("span");
      span.innerText = char;
      this.processChar(span);
      return span;
    });

    fragment.append(...chars);
    element.replaceChildren(fragment);
    this.chars = chars;
  }

  private async wrapLines() {
    await nextAnimationFrame();
    const fragment = document.createDocumentFragment();
    const lineCollection: HTMLSpanElement[][] = [];

    let lineOffset = -Infinity;
    let wordOffset: number;
    for (const word of this.words) {
      wordOffset = word.offsetTop;
      if (wordOffset > lineOffset) {
        lineOffset = wordOffset;
        lineCollection.push([]);
      }
      lineCollection[lineCollection.length - 1].push(word);
    }

    const lines = lineCollection.map((line) => {
      const span = document.createElement("span");
      span.append(...line);
      this.processLine(span);
      return span;
    });

    fragment.append(...lines);
    this.element.replaceChildren(fragment);
    this.lines = lines;
  }

  private getTextContent(element: HTMLElement) {
    const textNode = element.firstChild;
    if (!(textNode instanceof Text)) throw new Error("Child node is not Text");
    return textNode.nodeValue ?? "";
  }
}
