import { PropsWithChildren, useEffect, useRef } from "react";
import { SmoothScroll as Smooth } from "../../utils/SmoothScroll";
import styles from "./SmoothScroll.module.scss";

export type SmoothScrollProps = PropsWithChildren<{}>;

export function SmoothScroll({ children }: SmoothScrollProps) {
  const container = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const smoothScroll = useRef<Smooth>();

  useEffect(() => {
    const { destroy } = (smoothScroll.current = new Smooth(
      container.current!,
      content.current!
    ));

    return destroy;
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
