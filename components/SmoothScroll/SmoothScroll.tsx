import gsap from "gsap";
import { PropsWithChildren, useEffect, useRef } from "react";
import { Box } from "../layout/Box/Box";
import styles from "./SmoothScroll.module.css";

export type SmoothScrollProps = PropsWithChildren<{}>;

export function SmoothScroll({ children }: SmoothScrollProps) {
  const container = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current || !content.current) return;
    container.current.style.height = content.current.offsetHeight + "px";
  });

  useEffect(() => {
    if (!content.current) return;
    const smoothScroll = createSmoothScroll(content.current);
    smoothScroll.init();
    return smoothScroll.destroy;
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
};

function createSmoothScroll(
  target: HTMLElement,
  { smoothness = 0.2 }: SmoothScrollSettings = {}
) {
  let scrollY = window.scrollY;
  let animateY = scrollY;
  const setY = gsap.quickSetter(target, "y", "px");

  function getScrollPosition() {
    scrollY = window.scrollY;
  }

  function updateScrollPosition() {
    animateY = gsap.utils.interpolate(animateY, scrollY, smoothness);
    setY(-animateY);
  }

  function destroy() {
    gsap.ticker.remove(getScrollPosition);
    gsap.ticker.remove(updateScrollPosition);
  }

  function init() {
    gsap.ticker.add(getScrollPosition);
    gsap.ticker.add(updateScrollPosition);
    gsap.set(target, { z: "0px" });
  }

  return {
    init,
    destroy,
  };
}
