import gsap, { Elastic } from "gsap";

export const animateLineStartValues = {
  opacity: 0,
  y: 30,
  rotation: 30,
  scaleY: 1.7,
  transformOrigin: "top left",
};

export function animateLine({
  line,
  duration = 0.5,
  stagger = 0,
  delay = 0,
}: {
  line: HTMLSpanElement;
  duration?: number;
  stagger?: number;
  delay?: number;
}) {
  const targets = line.querySelectorAll("span");
  const timeline = gsap.timeline({
    clearProps: "all",
  });

  timeline.set(targets, { transformOrigin: "left center" });

  timeline.to(
    targets,
    {
      opacity: 1,
      y: 0,
      rotation: 0,
      duration,
      stagger,
      delay,
    },
    0
  );

  timeline.to(
    targets,
    {
      scaleY: 1,
      duration: duration * 4,
      stagger,
      delay,
      ease: Elastic.easeOut.config(1.75, 0.3),
    },
    0
  );

  timeline.set(targets, { clearProps: "all" });
}

export function animateLines({
  lines,
  duration = 0.5,
  stagger,
  delay = 0.1,
}: {
  lines: NodeListOf<HTMLSpanElement> | HTMLSpanElement[];
  duration?: number;
  stagger: number;
  delay?: number;
}) {
  lines.forEach((line, index) => {
    const delay = 0.1 * index;
    animateLine({
      line,
      duration,
      stagger,
      delay,
    });
  });
}
