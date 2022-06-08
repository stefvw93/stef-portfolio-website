import { gql } from "@urql/core";
import type { NextPage, InferGetStaticPropsType } from "next";
import { ExperienceComponent } from "../components/Experience/ExperienceComponent";
import { Hud } from "../components/Hud/Hud";
import { MainHead } from "../components/MainHead";
import { Section } from "../components/Section/Section";
import { ScrollContainer } from "../components/ScrollContainer/ScrollContainer";
import { Query, QueryPostArgs } from "../generated/graphql";
import { gqlClient } from "../graphql/gql-client";
import { About } from "../components/About/About";
import { Career } from "../components/Career/Career";
import { Contact } from "../components/Contact/Contact";
import { useEffect } from "react";

const Home: NextPage = ({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  useEffect(() => {}, []);

  return (
    <>
      <MainHead />
      <ExperienceComponent />

      <ScrollContainer>
        <main className="main">
          {posts?.map((post, index) => (
            <Section
              key={post.id}
              id={post.slug ?? undefined}
              title={post.title ?? undefined}
              contentComponent={post.slug === "contact" ? "footer" : undefined}
            >
              {post.slug === "about" && <About post={post} />}
              {post.slug === "career" && <Career post={post} />}
              {post.slug === "contact" && <Contact post={post} />}
            </Section>
          ))}
        </main>
      </ScrollContainer>

      <Hud
        links={posts?.map((post) => ({ name: post.title, href: post.slug }))}
      />
    </>
  );
};

export async function getStaticProps() {
  const { data, error } = await gqlClient
    .query<{ posts: Query["posts"] }, QueryPostArgs>(
      gql`
        query Posts($where: PostWhereInput!) {
          posts(where: $where) {
            id
            title
            slug
            content {
              document
            }
            resume {
              id
              experiences {
                id
                year
                company
                role
                skills {
                  id
                  name
                }
              }
            }
          }
        }
      `,
      {
        where: {},
      }
    )
    .toPromise();

  console.log(data, error);
  if (!data || error) return { props: {} };
  return { props: { posts: data.posts } };
}

export default Home;
