import { DocumentRenderer } from "@keystone-6/document-renderer";
import type { NextPage, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { query } from "../graphql/gql-client";
import styles from "../styles/Home.module.css";

const Home: NextPage = ({
  test,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>stefvw.dev</title>
        <meta
          name="description"
          content="Stef van Wijchen front end developer portfolio"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👨‍💻</text></svg>"
        />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Hello I am Stef</h1>
        <DocumentRenderer document={test?.post?.content?.document} />
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
};

export async function getStaticProps() {
  const { data, error } = await query.post({ slug: "test" });
  if (error) return { props: {} };
  return { props: { test: data } };
}

export default Home;
