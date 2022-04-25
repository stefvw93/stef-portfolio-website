import gsap from "gsap";
import { PropsWithChildren, useEffect, useRef } from "react";
import styles from "./SmoothScroll.module.scss";

export type SmoothScrollProps = PropsWithChildren<{}>;

export function SmoothScroll({ children }: SmoothScrollProps) {
  const container = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { init, destroy } = createSmoothScroll(
      container.current!,
      content.current!
    );
    init();
    return destroy;
  }, []);

  return (
    <div className={styles.container} ref={container}>
      <div className={styles.content} ref={content}>
        {children}
      </div>
    </div>
  );
}

export type SmoothScrollSettings = {
  smoothness?: number;
  fps?: number;
};

function createSmoothScroll(
  container: HTMLElement,
  target: HTMLElement,
  { smoothness = 0.2, fps = 60 }: SmoothScrollSettings = {}
) {
  let scrollY = window.scrollY;
  let animateY = scrollY;
  const targetFrameDelta = 1000 / fps;
  const setY = gsap.quickSetter(target, "y", "px");

  function getScrollPosition() {
    scrollY = window.scrollY;
  }

  function updateScrollPosition(_: number, deltaTime: number) {
    const progress = smoothness * (targetFrameDelta / deltaTime);
    animateY = gsap.utils.interpolate(animateY, scrollY, progress);
    setY(-animateY);
  }

  function handleResize() {
    console.log("handleresize");
    destroy();
    init();
  }

  function destroy() {
    gsap.ticker.remove(getScrollPosition);
    gsap.ticker.remove(updateScrollPosition);
    window.removeEventListener("resize", handleResize);
  }

  function init() {
    container.style.height = target.offsetHeight + "px";
    gsap.ticker.add(getScrollPosition);
    gsap.ticker.add(updateScrollPosition);
    window.addEventListener("resize", handleResize);
  }

  return {
    init,
    destroy,
  };
}
