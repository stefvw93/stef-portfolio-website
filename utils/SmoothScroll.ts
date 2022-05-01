import gsap from "gsap";

export type SmoothScrollConfig = {
  smoothness: number;
  fps: number;
  onUpdate?(time: number, deltaTime: number): void;
};

export class SmoothScroll {
  private scrollY: number = window.scrollY;
  private animateY: number = this.scrollY;
  private framerate: number;
  private setY: (y: number) => void;
  private readonly getScrollPosition = () => (this.scrollY = window.scrollY);

  config: SmoothScrollConfig = { smoothness: 0.1, fps: 60 };
  get y() {
    return this.animateY;
  }

  constructor(
    public readonly container: HTMLElement,
    public readonly target: HTMLElement,
    config: Partial<SmoothScrollConfig> = {}
  ) {
    this.config = Object.assign(this.config, config);
    this.framerate = 1000 / this.config.fps;
    this.setY = gsap.quickSetter(target, "y", "px") as any;
    this.updateScrollPosition = this.updateScrollPosition.bind(this);
    this.start();
  }

  destroy = () => {
    gsap.ticker.remove(this.updateScrollPosition);
    window.removeEventListener("scroll", this.getScrollPosition);
    window.removeEventListener("resize", this.handleResize);
  };

  private updateScrollPosition(time: number, deltaTime: number) {
    const progress = this.config.smoothness / (this.framerate / deltaTime);
    this.animateY = gsap.utils.interpolate(
      this.animateY,
      this.scrollY,
      progress
    );
    this.config.onUpdate?.(time, deltaTime);
    this.setY(Math.abs(this.animateY) < 0.01 ? 0 : -this.animateY);
  }

  private handleResize() {
    this.destroy();
    this.start();
  }

  private start() {
    if (window.ontouchstart || navigator.maxTouchPoints > 0) {
      return;
    }

    this.container.style.height = this.target.offsetHeight + "px";
    this.target.style.position = "fixed";
    gsap.ticker.add(this.updateScrollPosition);
    window.addEventListener("scroll", this.getScrollPosition);
    window.addEventListener("resize", this.handleResize);
  }
}
