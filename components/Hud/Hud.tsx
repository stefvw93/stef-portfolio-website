import { MouseEvent, useEffect, useRef } from "react";
import gsap, { Power1 } from "gsap";
import { SmoothScroll } from "../../utils/SmoothScroll";
import styles from "./Hud.module.scss";
import { classes } from "../../utils/classes";

type HudProps = {
  links?: { name?: string | null; href?: string | null }[];
};

export function Hud({ links }: HudProps) {
  const handleAnchorClick = useRef(
    (event: MouseEvent<HTMLAnchorElement, Event>) => {
      event.preventDefault();
      if (!SmoothScroll.instance) return;
      const query = event.currentTarget.getAttribute("href");
      if (!query) return;
      gsap.to(SmoothScroll.instance.scrollingElement, {
        scrollTo: query,
        duration: 1,
        ease: Power1.easeInOut,
      });
    }
  );

  return (
    <>
      <nav className={classes(styles.navigation, styles.top)}>
        <h1 className={styles.myName}>
          <a href="#__next" onClick={handleAnchorClick.current}>
            Stef van Wijchen
          </a>
        </h1>
        <div className={styles.links}>
          {links?.map((link) => (
            <a
              key={link.href}
              href={"#" + link.href}
              onClick={handleAnchorClick.current}
            >
              {link.name}
            </a>
          ))}
        </div>
      </nav>

      <nav className={classes(styles.navigation, styles.bottom)}>
        <div>&copy; {new Date().getFullYear()}</div>
        <div className={styles.external}>
          <span className={styles.by}>Code &amp; design by me</span>
          <a
            href="https://github.com/stefvw93/"
            target="_blank"
            rel="noreferrer"
          >
            <img src="/images/icon-github.svg" alt="Github" />
          </a>
          <a
            href="https://www.linkedin.com/in/stef-van-wijchen-81206861/"
            target="_blank"
            rel="noreferrer"
          >
            <img src="/images/icon-linkedin.svg" alt="LinkedIn" />
          </a>
        </div>
      </nav>

      <ScrollBar />
    </>
  );
}

function ScrollBar() {
  const setWidth = useRef<Function>();
  const setBodyGradient = useRef<Function>();
  const setDocumentGradient = useRef<Function>();
  const bar = useRef<HTMLDivElement>(null);

  const updateScrollBar = useRef((time: number, deltaTime: number) => {
    if (!SmoothScroll.instance) return;

    const progress =
      SmoothScroll.instance.smoothY /
      (SmoothScroll.instance.scrollHeight - window.innerHeight);

    if (isNaN(progress)) return;

    const cssValue = `${gsap.utils.clamp(0, 100, progress * 100).toFixed(3)}%`;
    setWidth.current!(cssValue);
  });

  useEffect(() => {
    const updater = updateScrollBar.current;
    gsap.ticker.add(updater);
    setWidth.current = gsap.quickSetter(bar.current!, "width");
    setBodyGradient.current = gsap.quickSetter(document.body, "background");
    setDocumentGradient.current = gsap.quickSetter(document.body, "background");
    return () => gsap.ticker.remove(updater);
  }, []);

  return (
    <div className={styles.scrollBarContainer}>
      <div ref={bar} className={styles.scrollBar} />
    </div>
  );
}
