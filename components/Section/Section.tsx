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
    ScrollTrigger.create({
      trigger: ref.current!,
      onEnter() {
        console.log("enter");
      },
    });
  }, []);

  return (
    <section ref={ref} className={styles.container} {...rest}>
      <header>
        <h2 className={styles.title}>{rest.title}</h2>
      </header>
      <article>{children}</article>
    </section>
  );
}
