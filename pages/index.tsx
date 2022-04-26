import type { NextPage, InferGetStaticPropsType } from "next";
import { DocumentRenderer } from "@keystone-6/document-renderer";
import { MainHead } from "../components/MainHead";
import { query } from "../graphql/gql-client";
import styles from "../styles/Home.module.scss";
import { Scaffold } from "../components/Scaffold/Scaffold";
import { useEffect } from "react";
import { slideLinesFadeWords } from "../utils/animations/text";
import { Preloader } from "../components/Preloader/Preloader";
import { SplitText } from "../utils/splitText";

function animate() {
  const animated = document.getElementsByClassName("animated-lines");
  slideLinesFadeWords(animated[0] as HTMLElement);
}

const Home: NextPage = ({
  test,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  useEffect(() => {
    const animated = document.getElementsByClassName("animated-lines");
    SplitText.split(animated[0] as HTMLElement, {
      wordSpanAttrs: { class: styles.word },
      lineSpanAttrs: { class: "line" },
    });
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
      <Preloader onComplete={animate} />
    </>
  );
};

export async function getStaticProps() {
  const { data, error } = await query.post({ slug: "hello" });
  return { props: error ? {} : { test: data } };
}

export default Home;
