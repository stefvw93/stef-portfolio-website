import { HTMLAttributes, PropsWithChildren, useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import styles from "./Section.module.scss";
import { SmoothScroll } from "../../utils/SmoothScroll";

type SectionProps = {
  contentComponent?: keyof JSX.IntrinsicElements;
} & HTMLAttributes<HTMLDivElement>;

export function Section({
  children,
  contentComponent = "article",
  ...rest
}: PropsWithChildren<SectionProps>) {
  const ref = useRef<HTMLDivElement>(null);
  const ContentNode = contentComponent;

  useEffect(() => {
    const scrollTrigger = ScrollTrigger.create({
      trigger: ref.current!,
    });
    return () => scrollTrigger.kill();
  }, []);

  return (
    <section ref={ref} className={styles.container} {...rest} title={undefined}>
      <header>
        <h1 className={styles.title}>{rest.title}</h1>
      </header>
      <ContentNode className={styles.content}>{children}</ContentNode>
    </section>
  );
}
