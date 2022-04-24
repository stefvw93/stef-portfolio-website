import gsap from "gsap";
import { PropsWithChildren, useEffect, useRef } from "react";
import { Box } from "../layout/Box/Box";
import styles from "./SmoothScroll.module.css";

export type SmoothScrollProps = PropsWithChildren<{}>;

export function SmoothScroll({ children }: SmoothScrollProps) {
  const container = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    container.current!.style.height = content.current!.offsetHeight + "px";
  });

  useEffect(() => {
    const { init, destroy } = createSmoothScroll(content.current!);
    init();
    return destroy;
  }, []);

  return (
    <Box className={styles.container} ref={container}>
      <Box className={styles.content} ref={content}>
        {children}
      </Box>
    </Box>
  );
}

export type SmoothScrollSettings = {
  smoothness?: number;
  fps?: number;
};

function createSmoothScroll(
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

  function destroy() {
    gsap.ticker.remove(getScrollPosition);
    gsap.ticker.remove(updateScrollPosition);
  }

  function init() {
    gsap.ticker.add(getScrollPosition);
    gsap.ticker.add(updateScrollPosition);
  }

  return {
    init,
    destroy,
  };
}
