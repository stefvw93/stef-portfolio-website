import { PropsWithChildren, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { classes } from "../../utils/classes";
import { SmoothScroll } from "../../utils/SmoothScroll";
import styles from "./ScrollContainer.module.scss";

export type ScrollContainerProps = PropsWithChildren<{}>;

export function ScrollContainer({ children }: ScrollContainerProps) {
  const container = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const smoothScroll = useRef<SmoothScroll>();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const { destroy } = (smoothScroll.current = new SmoothScroll(
      container.current!,
      content.current!
    ));

    return destroy;
  }, []);

  return (
    <div
      className={classes(styles.container, "hide-scroll-bar")}
      ref={container}
    >
      <div className={styles.content} ref={content}>
        {children}
      </div>
    </div>
  );
}
