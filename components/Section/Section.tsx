import { HTMLAttributes, PropsWithChildren } from "react";
import styles from "./Section.module.scss";

export function Section({
  children,
  ...rest
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={styles.container} {...rest}>
      {children}
    </div>
  );
}
