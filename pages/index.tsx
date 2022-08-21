import { gql } from "@urql/core";
import type { NextPage, InferGetStaticPropsType } from "next";
import { ExperienceComponent } from "../components/Experience/ExperienceComponent";
import { Hud } from "../components/Hud/Hud";
import { MainHead } from "../components/MainHead";
import { Section } from "../components/Section/Section";
import { Query, QueryPostArgs } from "../generated/graphql";
import { gqlClient } from "../graphql/gql-client";
import { About } from "../components/About/About";
import { Career } from "../components/Career/Career";
import { Contact } from "../components/Contact/Contact";
import { useEffect, useRef } from "react";
import { PointerChaser } from "../utils/PointerChaser";
import { ScrollMotion } from "../utils/ScrollMotion";

const Home: NextPage = ({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const scrollRoot = useRef<HTMLDivElement>(null);

  useEffect(
    () =>
      new PointerChaser(["a"], {
        container: document.querySelector(".experience") as HTMLElement,
      }).destroy,
    []
  );

  useEffect(
    () =>
      console.log(
        "Hello there. If you also want to sniff around my source code, my website is a public repo: https://github.com/stefvw93/stef-portfolio-website"
      ),
    []
  );

  useEffect(() => new ScrollMotion(scrollRoot.current!).destroy, []);

  return (
    <>
      <MainHead />
      <ExperienceComponent />

      <main className="main" ref={scrollRoot}>
        {posts?.map((post, index) => (
          <div key={post.id} className={ScrollMotion.outerChildClassName}>
            <div className={ScrollMotion.innerChildClassName}>
              <Section
                id={post.slug ?? undefined}
                title={post.title ?? undefined}
                contentComponent={
                  post.slug === "contact" ? "footer" : undefined
                }
                className={ScrollMotion.innerChildClassName}
              >
                {post.slug === "about" && <About post={post} />}
                {post.slug === "career" && <Career post={post} />}
                {post.slug === "contact" && <Contact post={post} />}
              </Section>
            </div>
          </div>
        ))}
      </main>

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
                employer {
                  name
                  url
                  description
                }
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

  if (!data || error) return { props: {} };
  return { props: { posts: data.posts } };
}

export default Home;
