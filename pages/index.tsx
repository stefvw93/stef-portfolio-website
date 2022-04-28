import type { NextPage, InferGetStaticPropsType } from "next";
import { MainHead } from "../components/MainHead";
import { gqlClient } from "../graphql/gql-client";
import { Scaffold } from "../components/Scaffold/Scaffold";
import { useEffect } from "react";
import { slideLinesFadeWords } from "../utils/animations/text";
import { Preloader } from "../components/Preloader/Preloader";
import { gql } from "@urql/core";
import { Query, QueryPostsArgs } from "../generated/graphql";
import { Hello } from "../components/Hello/Hello";
import { Traits } from "../components/Traits/Traits";

const Home: NextPage = ({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  console.log(posts);
  return (
    <>
      <MainHead />
      <Scaffold>
        <Hello post={posts?.find((p) => p.slug === "hello")} />
        <Traits posts={posts?.filter((p) => p.categories === "about")} />
      </Scaffold>
      <Preloader />
    </>
  );
};

export async function getStaticProps() {
  const { data, error } = await gqlClient
    .query<{ posts: Query["posts"] }, QueryPostsArgs>(
      gql`
        query Posts($where: PostWhereInput!) {
          posts(where: $where) {
            id
            title
            slug
            layout
            categories
            content {
              document
            }
            traits {
              id
              title
            }
          }
        }
      `,
      {
        where: {},
      }
    )
    .toPromise();

  if (!data || error) return { props: {} };
  return { props: { posts: data.posts } };
}

export default Home;
