import gsap, { Power1, Elastic } from "gsap";

const getStartValues = (): gsap.TweenVars => ({
  opacity: 0,
  y: 30,
  willChange: ["opacity", "transform"].join(","),
  transformOrigin: "top left",
});

const getEndValues = (): gsap.TweenVars => ({
  opacity: 1,
  y: 0,
});

export type SlideUpConfig = {
  duration?: number;
  stagger?: gsap.TweenVars["stagger"];
  delay?: number;
};

export function slideUp(targets: gsap.TweenTarget, config: SlideUpConfig = {}) {
  const { duration = 2, stagger = 0.1, delay = 0 } = config;
  const from = getStartValues();
  const to = getEndValues();
  const timeline = gsap.timeline({ paused: true, delay });

  gsap.set(targets, from);

  // animate opacity
  timeline.to(targets, {
    duration: duration * 0.4,
    stagger,
    opacity: to.opacity,
  });

  // animate stretch and squash
  timeline.to(
    targets,
    {
      duration: duration,
      stagger,
      y: 0,
      ease: Elastic.easeOut.config(1, 0.75),
      onUpdate() {
        const targets = this.targets();
        for (const target of targets) {
          const start = from.y as number;
          const end = to.y as number;
          const current = gsap.getProperty(target, "y") as number;
          const total = Math.abs(end - start);
          const progress = Math.abs(start + current);
          const scaleY = 1 + (1 - total / progress);
          gsap.set(target, { scaleY });
        }
      },
    },
    0
  );

  return timeline;
}
