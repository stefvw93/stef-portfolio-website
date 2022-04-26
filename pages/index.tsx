import type { NextPage, InferGetStaticPropsType } from "next";
import { DocumentRenderer } from "@keystone-6/document-renderer";
import { Footer } from "../components/Footer";
import { MainHead } from "../components/MainHead";
import { SmoothScroll } from "../components/SmoothScroll/SmoothScroll";
import { query } from "../graphql/gql-client";
import styles from "../styles/Home.module.scss";
import { Scaffold } from "../components/Scaffold/Scaffold";
import { useEffect } from "react";
import { createSplitText } from "../utils/splitText";
import gsap, { Power2 } from "gsap";

const Home: NextPage = ({
  test,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  useEffect(() => {
    if (!window) return;
    const animated = document.getElementsByClassName("animated-lines");
    const splitText = createSplitText(animated[0] as HTMLParagraphElement, {
      wordSpanAttrs: { class: "word" },
      lineSpanAttrs: { class: "line" },
    });

    if (!splitText.words.length || !splitText.lines.length) return;

    gsap.set(splitText.words, { opacity: 0 });
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
        transformOrigin: "left",
        scale: 1,
      },
      {
        x: 0,
        duration: 1,
        stagger: -0.1,
        ease: Power2.easeOut,
        onComplete() {
          // splitText.reset();
        },
      }
    );
  }, []);

  return (
    <>
      <MainHead />
      <Scaffold>
        <div className={styles.helloContainer}>
          <article className={styles.hello}>
            <DocumentRenderer
              document={test?.post?.content?.document}
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
      </Scaffold>
    </>
  );
};

export async function getStaticProps() {
  const { data, error } = await query.post({ slug: "hello" });
  if (error) return { props: {} };
  return { props: { test: data } };
}

export default Home;
