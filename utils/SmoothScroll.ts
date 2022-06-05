import gsap from "gsap";
import { isTouchDevice } from "./isTouchDevice";

export type SmoothScrollConfig = {
  smoothness: number;
  fps: number;
  onUpdate?(time: number, deltaTime: number): void;
};

export class SmoothScroll {
  static instance?: SmoothScroll;
  style?: HTMLStyleElement;
  liveEvents: [
    HTMLElement | Window,
    keyof HTMLElementEventMap,
    (event: any) => any
  ][] = [];

  y = 0;
  smoothY = this.y;
  scrollHeight = 0;
  referenceFps = 60;
  referenceFrameMs = 1000 / this.referenceFps;

  constructor(readonly container: HTMLElement, readonly content: HTMLElement) {
    this.appendCSS();
    this.prepareAncestors();
    this.prepareContainer();
    this.prepareContent();
    this.start();
    SmoothScroll.instance = this;
  }

  updatePosition = (_: number, deltaTime: number) => {
    this.smoothY = gsap.utils.interpolate(
      this.smoothY,
      window.scrollY,
      0.2 * (this.referenceFrameMs / deltaTime)
    );

    for (const child of this.content.children) {
      if (!(child instanceof HTMLElement)) continue;
      gsap.set(child, { y: -this.smoothY });
    }
  };

  destroy = () => {
    this.stop();
    this.removeCSS();
  };

  start = () => {
    gsap.ticker.add(this.updatePosition);
  };

  stop = () => {
    gsap.ticker.remove(this.updatePosition);
  };

  prepareAncestors(element = this.container.parentElement) {
    if (!element) return;
    element.classList.add("scroll-parent");
    if (element.parentElement) this.prepareAncestors(element.parentElement);
  }

  prepareContainer() {
    this.container.classList.add("scroll-container");
  }

  prepareContent() {
    this.content.classList.add("scroll-content");
    if (isTouchDevice()) return;

    this.content.style.height =
      (this.scrollHeight = this.content.offsetHeight) + "px";

    for (const child of this.content.children) {
      if (!(child instanceof HTMLElement)) continue;
      const rect = child.getBoundingClientRect();
      child.style.width = rect.width + "px";
      child.style.height = rect.height + "px";
      child.style.position = "fixed";
      child.style.left = rect.left + "px";
      child.style.top = child.offsetTop + "px";
    }
  }

  appendCSS() {
    const style = document.createElement("style");
    style.id = "smooth-scroll";
    style.append(`
      .scroll-parent {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }

      .scroll-container {
        position: fixed;
        inset: 0;
        overflow-x: hidden;
        overflow-y: auto;
      }

      .scroll-content {
        display: flow-root;
      }

      @media (hover: hover) and (pointer: fine) {
        .scroll-parent {
          position: static;
        }

        .scroll-container {
          position: static;
          overflow: unset;
        }
      }
    `);

    this.style = style;
    window.document.head.append(style);
  }

  removeCSS() {
    if (!this.style) return;
    window.document.head.removeChild(this.style);
  }
}
