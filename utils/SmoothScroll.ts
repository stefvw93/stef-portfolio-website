import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";
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

  y = this.scrollY;
  smoothY = this.y;
  scrollHeight = 0;
  referenceFps = 60;
  referenceFrameMs = 1000 / this.referenceFps;

  get scrollY() {
    return this.scrollingElement instanceof Window
      ? this.scrollingElement.scrollY
      : this.scrollingElement.scrollTop;
  }

  get scrollingElement() {
    return isTouchDevice() ? this.container : window;
  }

  constructor(readonly container: HTMLElement, readonly content: HTMLElement) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.registerPlugin(ScrollToPlugin);
    this.appendCSS();
    this.prepareAncestors();
    this.prepareContainer();
    this.prepareContent();
    this.start();

    SmoothScroll.instance = this;
    document.documentElement.classList.add("hide-scroll-bar");
    window.addEventListener("resize", this.handleResize);
  }

  handleResize = () => {
    this.stop();
    this.destroy();
    this.appendCSS();
    this.prepareAncestors();
    this.prepareContainer();
    this.prepareContent();
    this.start();
  };

  updatePosition = (_: number, deltaTime: number) => {
    this.smoothY = gsap.utils.interpolate(
      this.smoothY,
      isTouchDevice() ? this.container.scrollTop : window.scrollY,
      0.25 * (deltaTime / this.referenceFrameMs)
    );

    if (isTouchDevice()) return;

    for (const child of this.content.children) {
      if (!(child instanceof HTMLElement)) continue;
      gsap.set(child, { y: -this.smoothY, force3D: true });
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

    this.content.style.height =
      (this.scrollHeight = this.content.offsetHeight) + "px";

    if (isTouchDevice()) return;

    for (const child of this.content.children) {
      if (!(child instanceof HTMLElement)) continue;
      const rect = child.getBoundingClientRect();
      child.setAttribute("style", "");
      child.style.width = "100%";
      child.style.position = "fixed";
      child.style.left = "0";
      child.style.top = "0";
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
    if (!this.style || window.document.head.contains(this.style)) return;
    window.document.head.removeChild(this.style);
  }
}
