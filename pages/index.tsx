import type { NextPage, InferGetStaticPropsType } from "next";
import { DocumentRenderer } from "@keystone-6/document-renderer";
import { MainHead } from "../components/MainHead";
import { query } from "../graphql/gql-client";
import styles from "../styles/Home.module.scss";
import { Scaffold } from "../components/Scaffold/Scaffold";
import { useEffect } from "react";
import { SplitText } from "../utils/splitText";
import gsap, { Power2 } from "gsap";

const Home: NextPage = ({
  test,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  useEffect(() => {
    const animated = document.getElementsByClassName("animated-lines");

    const splitText = new SplitText(animated[0] as HTMLParagraphElement, {
      wordSpanAttrs: { class: "word" },
      lineSpanAttrs: { class: "line" },
    });

    const { words, lines, destroy } = splitText;
    if (!words.length || !lines.length) return;

    gsap.set(words, { opacity: 0 });
    gsap.fromTo(
      words,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        stagger: -(1 / words.length) * 0.6,
      }
    );
    gsap.fromTo(
      lines,
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
          // reset();
        },
      }
    );

    return destroy.bind(splitText);
  }, []);

  return (
    <>
      <MainHead />
      <Scaffold>
        <div className={styles.helloContainer}>
          <article className={styles.hello}>
            {test?.post && (
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
            )}
          </article>
        </div>
      </Scaffold>
    </>
  );
};

export async function getStaticProps() {
  const { data, error } = await query.post({ slug: "hello" });
  return { props: error ? {} : { test: data } };
}

export default Home;
