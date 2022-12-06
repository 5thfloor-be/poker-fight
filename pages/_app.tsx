import "../styles/globals.css";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "../components/layout/Layout";
import UserContextProvider from "../context/UserContext";

function MyApp({ Component, pageProps }: AppProps) {
    if (typeof window !== "undefined") {
        matomo();
    }

  return (
    <UserContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserContextProvider>
  );
}

export default MyApp;

export function matomo() {
    if (document.getElementById("analytics") === null) {
        const matomoUrl = process.env.NEXT_PUBLIC_MATOMO_URL;
        const matomoSiteId = process.env.NEXT_PUBLIC_MATOMO_SITE_ID;
        console.debug('matomoUrl :', matomoUrl);
        console.debug('matomoSiteId :', matomoSiteId);
        var _paq = (window._paq = window?._paq || []);
        _paq.push(["trackPageView"]);
        _paq.push(["enableLinkTracking"]);
        (function () {
            var u = "//" + matomoUrl + "/";
            _paq.push(["setTrackerUrl", u + "matomo.php"]);
            _paq.push(["setSiteId", matomoSiteId]);
            var d = document,
                g = d.createElement("script"),
                s = d.getElementsByTagName("script")[0];
            g.async = true;
            g.src = u + "matomo.js";
            g.id = "analytics";
            s?.parentNode?.insertBefore(g, s);
        })();
    }
}
