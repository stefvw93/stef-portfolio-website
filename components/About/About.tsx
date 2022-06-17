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
    gsap.registerPlugin(ScrollTrigger);
    if (!container.current) return;

    const paragraphs = Array.from(container.current.querySelectorAll("p"));

    paragraphs.forEach((p) => {
      new SplitText(p, {
        wrapLines: true,
        wordSpanAttrs: { class: styles.animateWord },
        onComplete(instance) {
          const { element, lines } = instance;

          const animations = lines.map((line, index) => {
            const words = line.querySelectorAll(`.${styles.animateWord}`);
            return slideUp(words, {
              duration: 1,
              stagger: 0.05,
              delay: 0.1 * index,
            });
          });

          animationMap.current.set(element, {
            splitText: instance,
            animations,
            scrollTrigger: ScrollTrigger.create({
              markers: true,
              scroller: SmoothScroll.instance?.scrollingElement,
              trigger: p,
              start: "top 75%",
              once: true,
              onEnter() {
                animations?.forEach((a) => a.play());
              },
              onEnterBack() {
                animations?.forEach((a) => a.play());
              },
            }),
          });
        },
      });
    });

    return () => {
      paragraphs.forEach((p) => {
        const obj = animationMap.current?.get(p);
        obj?.scrollTrigger?.kill();
        obj?.splitText?.destroy();
      });
    };
  }, []);

  return (
    <div ref={container} className={styles.container}>
      <DocumentRenderer document={post.content?.document} />
    </div>
  );
}
