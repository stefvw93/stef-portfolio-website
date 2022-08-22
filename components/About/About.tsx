import { DocumentRenderer } from "@keystone-6/document-renderer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useEffect, useRef } from "react";
import { Post } from "../../generated/graphql";
import { TextMotion } from "../../utils/TextMotion";
import styles from "./About.module.scss";

type AboutProps = {
  post: Post;
};

export function About({ post }: AboutProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let scrollTrigger: ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    const raf = requestAnimationFrame(() => {
      const paragraphs = Array.from(container.current!.querySelectorAll("p"));
      scrollTrigger = ScrollTrigger.create({
        trigger: container.current,
        async onEnter() {
          const textMotions = paragraphs.map(
            (p) =>
              new TextMotion(p, {
                wrapLines: true,
                processLine(line) {
                  line.style.setProperty("--clip-y", "0%");
                  gsap.set(line, {
                    display: "inline-block",
                    willChange: "contents, transform",
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
              delay: 0.2,
              clearProps: [
                "--clip-y",
                "willChange",
                "clipPath",
                "transform",
              ].join(","),
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
