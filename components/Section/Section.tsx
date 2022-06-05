import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { HTMLAttributes, PropsWithChildren, useEffect, useRef } from "react";
import styles from "./Section.module.scss";

export function Section({
  children,
  ...rest
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create({
      trigger: ref.current!,
      onEnter() {
        console.log("enter");
      },
    });
  }, []);

  return (
    <div ref={ref} className={styles.container} {...rest}>
      {children}
    </div>
  );
}
