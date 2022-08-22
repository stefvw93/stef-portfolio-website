import { DocumentRenderer } from "@keystone-6/document-renderer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useEffect, useRef } from "react";
import { Post } from "../../generated/graphql";
import { slideUp } from "../../utils/animations/slideIn";
import { nextAnimationFrame } from "../../utils/nextAnimationFrame";
import { SCROLL_TRIGGER_START_DEFAULT } from "../../utils/shared";
import { SplitText } from "../../utils/splitText";
import { TextMotion } from "../../utils/TextMotion";
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

    let scrollTrigger: ScrollTrigger;

    const raf = requestAnimationFrame(() => {
      const paragraphs = Array.from(container.current!.querySelectorAll("p"));
      scrollTrigger = ScrollTrigger.create({
        trigger: container.current,
        start: "top 80%",
        async onEnter() {
          const textMotions = paragraphs.map(
            (p) =>
              new TextMotion(p, {
                wrapLines: true,
                processLine(line) {
                  line.style.setProperty("--clip-y", "0%");
                  gsap.set(line, {
                    display: "inline-block",
                    willChange: "contents",
                  });
                },
              })
          );

          const lines = (
            await Promise.all(textMotions.map((e) => e.getLines()))
          ).flat();

          await gsap.fromTo(
            lines,
            {
              y: 20,
              "--clip-y": "0%",
              clipPath:
                "polygon(0 0, 100% 0, 100% var(--clip-y), 0 var(--clip-y))",
            },
            {
              y: 0,
              "--clip-y": "100%",
              duration: 0.5,
              stagger: 0.1,
              delay: 0.3,
            }
          );

          scrollTrigger.kill();
        },
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      scrollTrigger?.kill();
    };
  }, []);

  return (
    <div ref={container} className={styles.container}>
      <DocumentRenderer document={post.content?.document} />
    </div>
  );
}
