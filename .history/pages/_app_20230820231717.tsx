import "./styles/globals.css";
import "./styles/styles.css";

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <Component {...pageProps} />
    </PageLayout>
  );
}

export default MyApp;
