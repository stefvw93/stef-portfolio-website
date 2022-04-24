declare namespace NodeJS {
  interface ProcessEnv {
    readonly API_URL: string;
  }
}

declare module "*.graphql" {
  import { DocumentNode } from "graphql";
  const Schema: DocumentNode;
  export = Schema;
}
