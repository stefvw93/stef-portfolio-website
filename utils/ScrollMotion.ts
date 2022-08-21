import gsap from "gsap";

export class ScrollMotion {
  static outerChildClassName = "smooth-parent";
  static innerChildClassName = "smooth-child";

  readonly outerChildren: HTMLElement[];
  readonly innerChildren: HTMLElement[] = [];
  virtuals: ScrollMotionVirtuals;
  scrollY = 0;
  smoothY = 0;
  referenceFps = 60;
  referenceFrameMs = 1000 / this.referenceFps;

  private doReadScrollPosition = true;
  private doHandleResize = true;
  private resizeTimeout?: ReturnType<typeof setTimeout>;
  private setup: gsap.core.Tween[] = [];

  constructor(public readonly root: HTMLElement) {
    this.outerChildren = Array.from(
      document.querySelectorAll(`.${ScrollMotion.outerChildClassName}`)
    ).filter((child) => child instanceof HTMLElement) as HTMLElement[];

    this.innerChildren = this.outerChildren.map((child) =>
      child.querySelector(`.${ScrollMotion.innerChildClassName}`)
    ) as HTMLElement[];

    this.virtuals = new ScrollMotionVirtuals(this.outerChildren);
    this.setOuterChildDimensions();
    this.setInnerChildPositions();

    gsap.ticker.add(this.handleTick);
    window.addEventListener("scroll", this.handleScroll);
    window.addEventListener("resize", this.handleResize);
    console.log(this);
  }

  destroy = () => {
    gsap.ticker.remove(this.handleTick);
    window.removeEventListener("scroll", this.handleScroll);
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
    if (!this.doReadScrollPosition) return;
    this.scrollY = window.scrollY;
    this.doReadScrollPosition = false;
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
      0.25 * (deltaTime / this.referenceFrameMs)
    );

    this.updateChildPositions();

    this.doReadScrollPosition = true;
  };

  private async undoSetup() {
    const tweens: gsap.core.Tween[] = [];
    while (this.setup.length) {
      tweens.push(this.setup.pop()!);
    }

    return await Promise.all(tweens);
  }

  private updateChildPositions() {
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
        gsap.set(child, { height: this.virtuals.heights.get(child) })
      )
    );
  }

  private setInnerChildPositions() {
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
