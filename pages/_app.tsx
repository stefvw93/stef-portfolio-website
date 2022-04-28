import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import gsap from "gsap";

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    console.log("gsap config", gsap.config({ force3D: true }));
  }, []);
  return <Component {...pageProps} />;
}

export default App;
