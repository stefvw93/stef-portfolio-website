import type { NextPage, InferGetStaticPropsType } from "next"
import { gqlClient } from "../graphql/gql-client"
import { gql } from "@urql/core"
import { Query, QueryPostsArgs } from "../generated/graphql"
import { ExperienceComponent } from "../components/Experience/ExperienceComponent"
import type { ReactElement } from "react"

const Home: NextPage = () => {
  return (
    <>
      <ExperienceComponent />
    </>
  )
}

// const Home: NextPage = ({
//   posts,
// }: InferGetStaticPropsType<typeof getStaticProps>) => {

// export async function getStaticProps() {
//   const { data, error } = await gqlClient
//     .query<{ posts: Query["posts"] }, QueryPostsArgs>(
//       gql`
//         query Posts($where: PostWhereInput!) {
//           posts(where: $where) {
//             id
//             title
//             slug
//             layout
//             categories
//             content {
//               document
//             }
//             traits {
//               id
//               title
//             }
//           }
//         }
//       `,
//       {
//         where: {},
//       }
//     )
//     .toPromise();

//   if (!data || error) return { props: {} };
//   return { props: { posts: data.posts } };
// }

export default Home
