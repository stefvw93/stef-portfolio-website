import { DocumentRenderer } from "@keystone-6/document-renderer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useEffect, useRef } from "react";
import { Post } from "../../generated/graphql";
import { slideUp } from "../../utils/animations/slideIn";
import {
  animateLines,
  animateLineStartValues,
} from "../../utils/animations/text";
import { SmoothScroll } from "../../utils/SmoothScroll";
import { SplitText } from "../../utils/splitText";
import styles from "./About.module.scss";

type AboutProps = {
  post: Post;
};

export function About({ post }: AboutProps) {
  const container = useRef<HTMLDivElement>(null);
  const animationMap = useRef<
    WeakMap<
      HTMLElement,
      {
        splitText?: SplitText;
        scrollTrigger?: ScrollTrigger;
        animations?: gsap.core.Animation[];
      }
    >
  >(new WeakMap());

  useEffect(() => {
    if (!container.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const paragraphs = Array.from(container.current.querySelectorAll("p"));

    paragraphs.forEach((p) => {
      console.log("setup p", animationMap.current?.get(p));
      if (animationMap.current?.get(p)) return;

      const splitText = new SplitText(p, {
        wrapLines: true,
        wordSpanAttrs: { class: styles.animateWord },
        onComplete({ element, lines }) {
          const animationObject = animationMap.current?.get(element);
          if (!animationObject) return;
          animationObject.animations = lines.map((line, index) => {
            const words = line.querySelectorAll(`.${styles.animateWord}`);
            return slideUp(words, {
              duration: 1,
              stagger: 0.05,
              delay: 0.1 * index,
            });
          });
        },
      });

      const scrollTrigger = new ScrollTrigger({
        markers: true,
        trigger: p,
        start: "top 75%",
        once: true,
        onEnter() {
          animationMap.current?.get(p)?.animations?.forEach((a) => a.play());
        },
        onEnterBack() {
          animationMap.current?.get(p)?.animations?.forEach((a) => a.play());
        },
      });

      animationMap.current!.set(p, { splitText, scrollTrigger });
    });

    // return () => {
    //   scrollTriggers.forEach((st) => st.kill());
    // };
  }, []);

  return (
    <div ref={container} className={styles.container}>
      <DocumentRenderer document={post.content?.document} />
    </div>
  );
}
