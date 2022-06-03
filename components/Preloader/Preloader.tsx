import gsap, { Power3 } from "gsap";
import { useEffect, useRef } from "react";
import {
  AnimationEvent,
  dispatchAnimationEvent,
  getAnimationEvent,
  globalEvents,
} from "../../utils/globalEvents";
import styles from "./Preloader.module.scss";

export type PreloaderProps = {
  onComplete?(): void;
};

export function Preloader({ onComplete }: PreloaderProps) {
  const container = useRef<HTMLDivElement>(null);
  const values = useRef({ clip: 0 });

  useEffect(() => {
    if (!container.current) return;

    gsap.killTweensOf(values.current);
    gsap.to(values.current, {
      clip: 100,
      duration: 3,
      delay: 1,
      ease: Power3.easeInOut,
      onUpdate() {
        gsap.set(container.current, {
          clipPath: `polygon(${values.current.clip}% 0%, 100% 0%, 100% 100%, ${values.current.clip}% 100%)`,
        });
      },
      onComplete() {
        dispatchAnimationEvent(AnimationEvent.PreloadComplete);
      },
    });
  }, []);

  return (
    <div ref={container} className={styles.preloader}>
      <h1>Stef van Wiechen</h1>
    </div>
  );
}
