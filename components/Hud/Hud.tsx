import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SmoothScroll } from "../../utils/SmoothScroll";
import styles from "./Hud.module.scss";
import { classes } from "../../utils/classes";

type HudProps = {
  links?: { name?: string | null; href?: string | null }[];
};

export function Hud({ links }: HudProps) {
  return (
    <>
      <nav className={classes(styles.navigation, styles.top)}>
        <div>Stef van Wijchen</div>
        <div className={styles.links}>
          {links?.map((link) => (
            <a key={link.href} href={"#" + link.href}>
              {link.name}
            </a>
          ))}
        </div>
      </nav>

      <nav className={classes(styles.navigation, styles.bottom)}>
        <div>2022</div>
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
