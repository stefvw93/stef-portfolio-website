import type { NextPage, InferGetStaticPropsType } from "next";
import { MainHead } from "../components/MainHead";
import { gqlClient } from "../graphql/gql-client";
import { Scaffold } from "../components/Scaffold/Scaffold";
import { useEffect } from "react";
import { slideLinesFadeWords } from "../utils/animations/text";
import { Preloader } from "../components/Preloader/Preloader";
import { gql } from "@urql/core";
import { Query, QueryPostsArgs } from "../generated/graphql";
import { BigText } from "../components/BigText/BigText";

const Home: NextPage = ({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  console.log(posts);
  return (
    <>
      <MainHead />
      <Scaffold>
        {posts?.map((post) => {
          if (post.slug === "hello") {
            return <BigText key={post.id} post={post} />;
          }

          return <BigText key={post.id} post={post} />;
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
