import "./styles/globals.css";
import "./styles/styles.css";

import type { AppProps } from "next/app";
import PageLayout from "../components/PageLayout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PageLayout>
      <Component {...pageProps} />
    </PageLayout>
  );
}

export default MyApp;
