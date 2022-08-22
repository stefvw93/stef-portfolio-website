import gsap from "gsap";
import { isTouchDevice } from "./isTouchDevice";

export class ScrollMotion {
  static outerChildClassName = "smooth-parent";
  static innerChildClassName = "smooth-child";
  static instance?: ScrollMotion;

  readonly scroller: Window | HTMLElement;
  readonly outerChildren: HTMLElement[];
  readonly innerChildren: HTMLElement[] = [];
  virtuals: ScrollMotionVirtuals;
  scrollY = window.scrollY;
  smoothY = this.scrollY;
  referenceFps = 60;
  referenceFrameMs = 1000 / this.referenceFps;

  private doHandleScroll = true;
  private resizeTimeout?: ReturnType<typeof setTimeout>;
  private setup: gsap.core.Tween[] = [];

  constructor(public readonly root: HTMLElement) {
    this.scroller = isTouchDevice() ? root : window;

    this.outerChildren = Array.from(
      document.querySelectorAll(`.${ScrollMotion.outerChildClassName}`)
    ).filter((child) => child instanceof HTMLElement) as HTMLElement[];

    this.innerChildren = this.outerChildren.map((child) =>
      child.querySelector(`.${ScrollMotion.innerChildClassName}`)
    ) as HTMLElement[];

    this.virtuals = new ScrollMotionVirtuals(this.outerChildren);
    this.setTouchDeviceOverflowBehaviour();
    this.setOuterChildDimensions();
    this.setInnerChildPositions();

    gsap.ticker.add(this.handleTick);
    this.scroller.addEventListener("scroll", this.handleScroll);
    window.addEventListener("resize", this.handleResize);

    ScrollMotion.instance = this;
  }

  destroy = () => {
    gsap.ticker.remove(this.handleTick);
    this.scroller.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleResize);
  };

  handleResize = () => {
    if (this.resizeTimeout != undefined) {
      clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = setTimeout(async () => {
      await this.undoSetup();
      this.virtuals = new ScrollMotionVirtuals(this.outerChildren);
      this.setOuterChildDimensions();
      this.setInnerChildPositions();
    }, 100);
  };

  handleScroll = () => {
    if (!this.doHandleScroll) return;
    this.scrollY =
      this.scroller === window
        ? window.scrollY
        : (this.scroller as HTMLElement).scrollTop;
    this.doHandleScroll = false;
  };

  handleTick = (
    time: number,
    deltaTime: number,
    frame: number,
    elapsed: number
  ) => {
    this.smoothY = gsap.utils.interpolate(
      this.smoothY,
      this.scrollY,
      0.1 * (deltaTime / this.referenceFrameMs)
    );

    this.updateChildPositions();

    this.doHandleScroll = true;
  };

  private setTouchDeviceOverflowBehaviour() {
    if (!isTouchDevice()) return;
    let element: HTMLElement | null = this.root;

    gsap.set("html, body", {
      overflow: "hidden",
    });

    gsap.set(this.root, {
      overflowY: "auto",
      top: 0,
    });

    while (element) {
      gsap.set(element, {
        width: "100%",
        height: "100%",
        position: "fixed",
      });
      element = element.parentElement;
    }
  }

  private async undoSetup() {
    const tweens: gsap.core.Tween[] = [];
    while (this.setup.length) {
      tweens.push(this.setup.pop()!);
    }

    return await Promise.all(tweens);
  }

  private updateChildPositions() {
    if (isTouchDevice()) return;
    let outerChild: HTMLElement;
    let innerChild: HTMLElement;
    let yOffset = 0;
    for (let i = 0, l = this.outerChildren.length; i < l; i++) {
      outerChild = this.outerChildren[i];
      innerChild = this.innerChildren[i];
      yOffset = this.virtuals.yOffsets.get(outerChild) ?? 0;
      gsap.set(innerChild, { y: yOffset - this.smoothY, force3D: true });
    }
  }

  private setOuterChildDimensions() {
    this.setup.push(
      ...this.outerChildren.map((child) =>
        gsap.set(child, {
          height: this.virtuals.heights.get(child),
          position: "relative",
        })
      )
    );
  }

  private setInnerChildPositions() {
    if (isTouchDevice()) return;
    this.setup.push(
      ...this.outerChildren.map((outerChild, index) => {
        const innerChild = this.innerChildren[index];

        if (!(innerChild instanceof HTMLElement)) {
          console.error("Could not find inner child", innerChild);
          throw new Error("Could not find inner child");
        }

        return gsap.set(innerChild, {
          position: "fixed",
          width: "100%",
          top: 0,
          y: this.virtuals.yOffsets.get(outerChild),
          willChange: "transform",
        });
      })
    );
  }
}

class ScrollMotionVirtuals {
  public scrollHeight = 0;
  public yOffsets = new WeakMap<HTMLElement, number>();
  public heights = new WeakMap<HTMLElement, number>();

  constructor(public readonly children: HTMLElement[]) {
    children.forEach((child) => {
      this.scrollHeight += child.offsetHeight;
      this.yOffsets.set(child, child.offsetTop);
      this.heights.set(child, child.offsetHeight);
    });
  }
}
