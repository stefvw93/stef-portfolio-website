import { DocumentRenderer } from "@keystone-6/document-renderer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useEffect, useRef } from "react";
import { Post } from "../../generated/graphql";
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
  const splitTexts = useRef<Map<HTMLParagraphElement, SplitText>>();

  useEffect(() => {
    if (!container.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const paragraphs = Array.from(container.current.querySelectorAll("p"));
    /**
     * Animation settings
     */
    const duration = 0.3;
    const stagger = 0.1;
    splitTexts.current = new Map(
      paragraphs.map((p) => [
        p,
        new SplitText(p, {
          wrapLines: true,
          wordSpanAttrs: { class: styles.animateWord },
          lineSpanAttrs: { class: styles.animateLine },
          onComplete({ words }) {
            gsap.set(words, animateLineStartValues);
          },
        }),
      ])
    );

    const scrollTriggers: ScrollTrigger[] = paragraphs.map((p) => {
      return ScrollTrigger.create({
        // markers: true,
        trigger: p,
        start: "top 75%",
        once: true,
        onEnter() {
          const lines = splitTexts.current?.get(p)?.lines ?? [];
          animateLines({ lines, duration, stagger });
        },
        onEnterBack() {
          const lines = splitTexts.current?.get(p)?.lines ?? [];
          animateLines({ lines, duration, stagger });
        },
      });
    });

    return () => {
      scrollTriggers.forEach((st) => st.kill());
    };
  }, []);

  return (
    <div ref={container} className={styles.container}>
      <DocumentRenderer document={post.content?.document} />
    </div>
  );
}
