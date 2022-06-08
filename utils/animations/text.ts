import gsap, { Elastic } from "gsap";

export const animateLineStartValues = {
  opacity: 0,
  y: 30,
  rotation: 30,
  scaleY: 1.5,
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

  gsap.to(targets, {
    opacity: 1,
    y: 0,
    rotation: 0,
    duration,
    stagger,
    delay,
  });

  gsap.to(targets, {
    scaleY: 1,
    duration: duration * 4,
    stagger,
    delay,
    ease: Elastic.easeOut.config(1.75, 0.5),
  });
}

export function animateLines({
  lines,
  duration,
  stagger,
}: {
  lines: NodeListOf<HTMLSpanElement> | HTMLSpanElement[];
  duration: number;
  stagger: number;
}) {
  console.log("animate lines", lines);
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
