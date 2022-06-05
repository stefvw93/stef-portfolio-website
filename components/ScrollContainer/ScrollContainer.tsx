import { PropsWithChildren, useEffect, useRef } from "react";
import { classes } from "../../utils/classes";
import { SmoothScroll } from "../../utils/SmoothScroll";
import styles from "./ScrollContainer.module.scss";

export type ScrollContainerProps = PropsWithChildren<{}>;

export function ScrollContainer({ children }: ScrollContainerProps) {
  const container = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const smoothScroll = useRef<SmoothScroll>();

  useEffect(() => {
    const { destroy } = (smoothScroll.current = new SmoothScroll(
      container.current!,
      content.current!
    ));

    console.log("mount");
    return () => {
      console.log("destroy");
      destroy();
    };
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
