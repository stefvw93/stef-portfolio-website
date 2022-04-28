import { DocumentRenderer } from "@keystone-6/document-renderer";
import gsap, { Power2 } from "gsap";
import { useEffect, useRef } from "react";
import { Post } from "../../generated/graphql";
import { AnimationEvent } from "../../utils/globalEvents";
import { SplitText } from "../../utils/splitText";
import styles from "./BigText.module.scss";

export type HelloProps = {
  post: Post;
};

export function BigText({ post }: HelloProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animated =
      container.current!.getElementsByClassName("animated-lines");

    if (!animated[0]) return;

    const splitText = new SplitText(animated[0] as HTMLElement, {
      wordSpanAttrs: { class: "word" },
      lineSpanAttrs: { class: "line" },
    });

    gsap.set(container.current!.getElementsByClassName("word"), { opacity: 0 });

    window.addEventListener(AnimationEvent.PreloadComplete, () => {
      const intersectionObserver = new IntersectionObserver(
        (entries, observer) => {
          if (!entries[0].isIntersecting) return;

          observer.disconnect();

          const duration = 0.8;

          gsap.fromTo(
            splitText.words,
            { opacity: 0 },
            {
              opacity: 1,
              duration,
              stagger: -(1 / splitText.words.length) * 0.6,
            }
          );

          gsap.fromTo(
            splitText.lines,
            {
              x: -20,
              display: "inline-block",
              backfaceVisibility: "hidden",
              scale: 1,
            },
            {
              x: 0,
              duration,
              stagger: -(1 / splitText.lines.length) * 0.6,
              ease: Power2.easeOut,
              onComplete() {
                // splitText.destroy();
              },
            }
          );
        },
        {
          threshold: 0.5,
        }
      );

      intersectionObserver.observe(container.current!);
    });
  }, []);

  return (
    <div ref={container} className={styles.helloContainer}>
      <article className={styles.hello}>
        <DocumentRenderer
          document={post.content?.document}
          renderers={{
            block: {
              paragraph: ({ children, textAlign }) => (
                <p className="animated-lines" style={{ textAlign }}>
                  {children}
                </p>
              ),
            },
          }}
        />
      </article>
    </div>
  );
}
