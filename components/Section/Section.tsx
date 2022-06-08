import { HTMLAttributes, PropsWithChildren, useEffect, useRef } from "react";
import styles from "./Section.module.scss";

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

  useEffect(() => {}, []);

  return (
    <section ref={ref} className={styles.container} {...rest} title={undefined}>
      <header>
        <h2 className={styles.title}>{rest.title}</h2>
      </header>
      <ContentNode className={styles.content}>{children}</ContentNode>
    </section>
  );
}
