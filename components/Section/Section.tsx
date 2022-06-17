import { HTMLAttributes, PropsWithChildren, useRef } from "react";
import styles from "./Section.module.scss";

type SectionProps = {
  contentComponent?: keyof JSX.IntrinsicElements;
} & HTMLAttributes<HTMLDivElement>;

export function Section({
  children,
  contentComponent = "article",
  ...rest
}: PropsWithChildren<SectionProps>) {
  const ContentNode = contentComponent;

  return (
    <section className={styles.container} {...rest} title={undefined}>
      <header>
        <h1 className={styles.title}>{rest.title}</h1>
      </header>
      <ContentNode className={styles.content}>{children}</ContentNode>
    </section>
  );
}
