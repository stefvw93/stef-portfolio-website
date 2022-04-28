import { PropsWithChildren, useEffect } from "react";
import { SmoothScroll } from "../SmoothScroll/SmoothScroll";
import styles from "./Scaffold.module.scss";
import Link from "next/link";
import gsap from "gsap";
import { AnimationEvent } from "../../utils/globalEvents";

export type ScaffoldProps = PropsWithChildren<{}>;

export function Scaffold({ children }: ScaffoldProps) {
  useEffect(() => {
    document.body.classList.add("no-scroll");
    window.addEventListener(AnimationEvent.PreloadComplete, () => {
      document.body.classList.remove("no-scroll");
      gsap.fromTo(
        `.${styles.animateLink}`,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3, delay: 0.5, stagger: 0.1 }
      );
    });
  }, []);

  return (
    <>
      <nav className={styles.topMenu}>
        <Link href="/">
          <a className={styles.animateLink}>Stef van Wijchen</a>
        </Link>
        <div className={styles.topMenu_navigation}>
          <Link href="/about">
            <a className={styles.animateLink}>About</a>
          </Link>
          <Link href="/work">
            <a className={styles.animateLink}>Work</a>
          </Link>
          <Link href="/contact">
            <a className={styles.animateLink}>Contact</a>
          </Link>
        </div>
      </nav>

      <SmoothScroll>
        <main className={styles.main}>{children}</main>
      </SmoothScroll>

      <footer className={styles.bottomMenu}></footer>
    </>
  );
}
