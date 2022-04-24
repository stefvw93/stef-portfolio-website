import type { NextPage, InferGetStaticPropsType } from "next";
import { DocumentRenderer } from "@keystone-6/document-renderer";
import { Footer } from "../components/Footer";
import { MainHead } from "../components/MainHead";
import { SmoothScroll } from "../components/SmoothScroll/SmoothScroll";
import { query } from "../graphql/gql-client";
import styles from "../styles/Home.module.css";

const Home: NextPage = ({
  test,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div className={styles.container}>
      <MainHead />

      <SmoothScroll>
        <main className={styles.main}>
          <DocumentRenderer document={test?.post?.content?.document} />
          <div style={{ height: "200vh" }}></div>
        </main>
      </SmoothScroll>

      <Footer />
    </div>
  );
};

export async function getStaticProps() {
  const { data, error } = await query.post({ slug: "test" });
  if (error) return { props: {} };
  return { props: { test: data } };
}

export default Home;
