import Head from "next/head";

export function MainHead() {
  return (
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
  );
}
