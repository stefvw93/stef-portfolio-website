import gsap, { Power2 } from "gsap";
import { SplitText, SplitTextConfig } from "../splitText";

export function slideLinesFadeWords(
  target: HTMLElement,
  config: SplitTextConfig = {}
): SplitText {
  const splitText = new SplitText(target, config);

  gsap.fromTo(
    splitText.words,
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1,
      stagger: -(1 / splitText.words.length) * 0.6,
    }
  );

  gsap.fromTo(
    splitText.lines,
    {
      x: 20,
      display: "inline-block",
      backfaceVisibility: "hidden",
      scale: 1,
    },
    {
      x: 0,
      duration: 1,
      stagger: -0.1,
      ease: Power2.easeOut,
    }
  );

  return splitText;
}
