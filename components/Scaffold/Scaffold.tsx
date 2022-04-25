import { PropsWithChildren } from "react";
import { SmoothScroll } from "../SmoothScroll/SmoothScroll";
import styles from "./Scaffold.module.scss";
import Link from "next/link";

export type ScaffoldProps = PropsWithChildren<{}>;

export function Scaffold({ children }: ScaffoldProps) {
  return (
    <>
      <nav className={styles.topMenu}>
        <span>Stef van Wijchen</span>
        <div className={styles.topMenu_navigation}>
          <Link href="/about">About</Link>
          <Link href="/work">Work</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </nav>

      <SmoothScroll>
        <main className={styles.main}>{children}</main>
      </SmoothScroll>

      <footer className={styles.bottomMenu}></footer>
    </>
  );
}
