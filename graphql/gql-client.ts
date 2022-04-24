import { createClient } from "@urql/core";
import { PostQuery, PostWhereUniqueInput } from "../generated/graphql";
import POST_QUERY from "./post.query.graphql";

export const gqlClient = createClient({
  url: process.env.API_URL,
});

export const query = {
  post(where: PostWhereUniqueInput) {
    return gqlClient.query<PostQuery>(POST_QUERY, { where }).toPromise();
  },
};
