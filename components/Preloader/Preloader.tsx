import gsap, { Power3 } from "gsap";
import { useEffect, useRef } from "react";
import styles from "./Preloader.module.scss";

export type PreloaderProps = {
  onComplete?(): void;
};

export function Preloader({ onComplete }: PreloaderProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    const values = { clip: 0 };
    let completed = false;

    gsap.to(values, {
      clip: 100,
      duration: 3,
      delay: 1,
      ease: Power3.easeInOut,
      onUpdate() {
        gsap.set(container.current, {
          clipPath: `polygon(${values.clip}% 0%, 100% 0%, 100% 100%, ${values.clip}% 100%)`,
        });
      },
      onComplete,
    });
  }, [onComplete]);

  return (
    <div ref={container} className={styles.preloader}>
      <h1>Stef van Wijchen</h1>
    </div>
  );
}
