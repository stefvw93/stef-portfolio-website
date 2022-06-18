import Head from "next/head";
import { useEffect } from "react";
import { createGlobalEvents } from "../utils/globalEvents";

export function MainHead() {
  useEffect(() => {
    createGlobalEvents();
  }, []);

  return (
    <Head>
      <title>stef.codes</title>
      <meta
        name="description"
        content="Stef van Wijchen creative developer portfolio"
      />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
      ></meta>
      <link
        rel="icon"
        href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👨‍💻</text></svg>"
      />
    </Head>
  );
}
