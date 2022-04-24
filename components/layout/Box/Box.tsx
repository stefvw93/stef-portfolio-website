import {
  DetailedHTMLProps,
  ForwardedRef,
  forwardRef,
  HTMLAttributes,
  PropsWithChildren,
  useMemo,
} from "react";
import { cleanJoin } from "../../../utils/cleanJoin";
import styles from "./Box.module.css";

export type BoxProps<T extends HTMLElement> = PropsWithChildren<{
  tag?: string;
}> &
  DetailedHTMLProps<HTMLAttributes<T>, T>;

export const Box = forwardRef<HTMLElement, BoxProps<HTMLElement>>(
  (
    { children, className, tag, ...rest }: BoxProps<HTMLElement>,
    ref: ForwardedRef<HTMLElement>
  ) => {
    const _className = useMemo(() => cleanJoin(styles.box, className), []);
    const E = (tag || "div") as any;
    return (
      <E className={_className} ref={ref} {...rest}>
        {children}
      </E>
    );
  }
);
