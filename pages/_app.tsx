import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { createElement } from "react";

function App({ Component, pageProps }: AppProps) {
  return createElement(Component, { ...pageProps });
}

export default App;
