import gsap, { Back, Power1 } from "gsap";
import { isTouchDevice } from "./isTouchDevice";

type PointerChaserConfig = {
  container: HTMLElement;
  useTextEffect(hoverTarge?: HTMLElement): boolean;
  useBubbleEffect(hoverTarget?: HTMLElement): boolean;
};
export class PointerChaser {
  config: PointerChaserConfig;
  referenceFps = 60;
  referenceFrameMs = 1000 / this.referenceFps;
  hoverTargets!: HTMLElement[];
  currentHoverTarget?: HTMLElement;
  chaser?: HTMLElement;
  ctx?: CanvasRenderingContext2D;
  canvasSize = 300;
  pointerX = 0;
  pointerY = 0;
  baseChaserSize = 20;
  chaserSize = this.baseChaserSize;
  maxChaserSize = 200;
  chaserX = this.pointerX;
  chaserY = this.pointerY;
  bubbleTween?: gsap.core.Animation;

  constructor(
    private selectors: string[],
    config: Partial<PointerChaserConfig> = {}
  ) {
    const {
      container = document.body,
      useTextEffect = () => true,
      useBubbleEffect = () => true,
    } = config;

    this.config = {
      container,
      useTextEffect,
      useBubbleEffect,
    };

    if (!isTouchDevice()) {
      this.updateTargets();
      window.addEventListener("mousemove", this.handleMouseMove);
      window.addEventListener("scroll", this.handleScroll);
      gsap.ticker.add(this.handleTick);
    }
  }

  destroy = () => {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("scroll", this.handleScroll);
    gsap.ticker.remove(this.handleTick);
    this.chaser?.remove();
  };

  handleTick = (_: number, deltaTime: number) => {
    const progress = 0.1 * (deltaTime / this.referenceFrameMs);

    this.chaserX = gsap.utils.interpolate(
      this.chaserX,
      this.pointerX,
      progress
    );

    this.chaserY = gsap.utils.interpolate(
      this.chaserY,
      this.pointerY,
      progress
    );

    if (!this.chaser) return;

    gsap.set(this.chaser, {
      x: this.chaserX,
      y: this.chaserY,
    });

    if (this.ctx) {
      this.ctx?.clearRect(0, 0, this.canvasSize, this.canvasSize);
      this.ctx.fillStyle = "yellow";
      this.ctx.beginPath();
      this.ctx.arc(
        this.canvasSize * 0.5,
        this.canvasSize * 0.5,
        this.chaserSize * 0.5,
        0,
        2 * Math.PI
      );
      this.ctx.closePath();
      this.ctx.fill();
    }
  };

  handleScroll = () => {
    if (this.bubbleTween?.progress() !== 1) return;
    this.bubbleTween = gsap.to(this, {
      chaserSize: this.baseChaserSize,
      duration: 0.2,
      ease: Power1.easeOut,
    });
  };

  handleMouseMove = (event: MouseEvent) => {
    this.pointerX = event.clientX;
    this.pointerY = event.clientY;

    if (!this.chaser) this.createChaser();

    const path = event.composedPath();
    const hoverTarget = this.hoverTargets.find((element) =>
      path.includes(element)
    );

    const useBubbleEffect = this.config.useBubbleEffect(hoverTarget);
    if (!useBubbleEffect) return;

    if (hoverTarget && hoverTarget !== this.currentHoverTarget) {
      this.currentHoverTarget = hoverTarget;
      this.bubbleTween?.kill();
      this.bubbleTween = gsap.to(this, {
        chaserSize: this.maxChaserSize,
        duration: 0.5,
        ease: Back.easeOut.config(2.5),
      });
    }

    if (!hoverTarget) {
      this.currentHoverTarget = undefined;
      if (this.bubbleTween) {
        this.bubbleTween.kill();
        this.bubbleTween = gsap.to(this, {
          chaserSize: this.baseChaserSize,
          duration: 0.2,
          ease: Power1.easeOut,
        });
      }
    }
  };

  updateTargets = () => {
    this.hoverTargets = this.selectors
      .map((selectors) => Array.from(document.querySelectorAll(selectors)))
      .flat()
      .filter((e) => e instanceof HTMLElement) as HTMLElement[];
  };

  createChaser() {
    const container = document.createElement("div");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const scale = window.devicePixelRatio;
    const size = this.canvasSize;

    if (ctx) {
      canvas.style.width = canvas.style.height = size + "px";
      canvas.style.left = canvas.style.top = -(size * 0.5) + "px";
      canvas.style.position = "relative";
      canvas.width = size * scale;
      canvas.height = size * scale;
      ctx?.scale(scale, scale);
      container.append(canvas);
      this.ctx = ctx;
    }

    container.classList.add("pointer-chaser");
    container.style.transform = `translate(${this.pointerX}, ${this.pointerY})`;
    this.config.container?.append(container);
    this.chaser = container;
  }
}
