import type { NextPage, InferGetStaticPropsType } from "next";
import { MainHead } from "../components/MainHead";
import { gqlClient } from "../graphql/gql-client";
import styles from "../styles/Home.module.scss";
import { Scaffold } from "../components/Scaffold/Scaffold";
import { useEffect } from "react";
import { slideLinesFadeWords } from "../utils/animations/text";
import { Preloader } from "../components/Preloader/Preloader";
import { SplitText } from "../utils/splitText";
import { gql } from "@urql/core";
import { Query, QueryPostsArgs } from "../generated/graphql";
import { Hello } from "../components/Hello/Hello";
import { AnimationEvent } from "../utils/globalEvents";

function animate() {
  const animated = document.getElementsByClassName("animated-lines");
  slideLinesFadeWords(animated[0] as HTMLElement);
}

const Home: NextPage = ({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  useEffect(() => {
    window.addEventListener(AnimationEvent.PreloadComplete, () => {
      animate();
    });
  }, []);

  return (
    <>
      <MainHead />
      <Scaffold>
        {posts?.map((post) => {
          if (post.slug === "hello") {
            return <Hello key={post.id} post={post} />;
          }
        })}
      </Scaffold>
      <Preloader />
    </>
  );
};

export async function getStaticProps() {
  const { data, error } = await gqlClient
    .query<{ posts: Query["posts"] }, QueryPostsArgs>(
      gql`
        query HomePosts($where: PostWhereInput!) {
          posts(where: $where) {
            id
            title
            slug
            content {
              document
            }
            skills {
              id
              content
            }
          }
        }
      `,
      {
        where: {
          categories: {
            equals: "home",
          },
        },
      }
    )
    .toPromise();

  if (!data || error) return { props: {} };
  return { props: { posts: data.posts } };
}

export default Home;
