import gsap from "gsap";
import { PropsWithChildren, useEffect, useRef } from "react";
import styles from "./SmoothScroll.module.scss";

export type SmoothScrollProps = PropsWithChildren<{}>;

export function SmoothScroll({ children }: SmoothScrollProps) {
  const container = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const smoothScroll = useRef<ReturnType<typeof createSmoothScroll>>();

  useEffect(() => {
    const { init, destroy } = (smoothScroll.current = createSmoothScroll(
      container.current!,
      content.current!
    ));

    init();

    return () => {
      destroy();
    };
  }, []);

  return (
    <div className={styles.container} ref={container}>
      <div className={styles.content} ref={content}>
        <div className={styles.inner} ref={inner}>
          {children}
        </div>
      </div>
    </div>
  );
}

export type SmoothScrollSettings = {
  smoothness?: number;
  fps?: number;
  onTick?(time: number, deltaTime: number): void;
};

function createSmoothScroll(
  container: HTMLElement,
  target: HTMLElement,
  { smoothness = 0.1, fps = 60, onTick }: SmoothScrollSettings = {}
) {
  let scrollY = window.scrollY;
  let animateY = scrollY;
  let velocityY = 0;
  const targetFrameDelta = 1000 / fps;
  const setY = gsap.quickSetter(target, "y", "px");

  function getScrollPosition() {
    scrollY = window.scrollY;
  }

  function updateScrollPosition(time: number, deltaTime: number) {
    const progress = smoothness / (targetFrameDelta / deltaTime);
    const nextY = gsap.utils.interpolate(animateY, scrollY, progress);
    const pxMs = Math.abs(animateY - nextY) / deltaTime;
    velocityY = gsap.utils.interpolate(velocityY, pxMs, smoothness);
    animateY = nextY;
    onTick?.(time, deltaTime);
    // setY(-animateY);
    gsap.set(target, { y: -animateY, z: 1 });
  }

  function handleResize() {
    destroy();
    init();
  }

  function destroy() {
    gsap.ticker.remove(getScrollPosition);
    gsap.ticker.remove(updateScrollPosition);
    window.removeEventListener("resize", handleResize);
  }

  function init() {
    if (window.ontouchstart || navigator.maxTouchPoints > 0) {
      return;
    }

    container.style.height = target.offsetHeight + "px";
    target.style.position = "fixed";
    gsap.ticker.add(getScrollPosition);
    gsap.ticker.add(updateScrollPosition);
    window.addEventListener("resize", handleResize);
  }

  return {
    init,
    destroy,
    get y() {
      return animateY;
    },
    get velocity() {
      return velocityY;
    },
  };
}
