import type { NextPage, InferGetStaticPropsType } from "next";
import { DocumentRenderer } from "@keystone-6/document-renderer";
import { Footer } from "../components/Footer";
import { MainHead } from "../components/MainHead";
import { SmoothScroll } from "../components/SmoothScroll/SmoothScroll";
import { query } from "../graphql/gql-client";
import styles from "../styles/Home.module.scss";
import { Scaffold } from "../components/Scaffold/Scaffold";

const Home: NextPage = ({
  test,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <MainHead />
      <Scaffold>
        <div className={styles.helloContainer}>
          <article className={styles.hello}>
            <DocumentRenderer document={test?.post?.content?.document} />
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
