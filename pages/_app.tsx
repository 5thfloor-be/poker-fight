import "../styles/globals.css";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "../components/layout/Layout";
import UserContextProvider from "../context/UserContext";
import { Analytics } from './api/model/Analytics';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserContextProvider>
  );
}

export default MyApp;

declare global {
    interface Window { _paq: any; }
}

export function matomo(analytics: Analytics) {
    const analyticsToDelete: Analytics[] = ["analyticsError", "analyticsJoin", "analyticsRoom", "analytics"];
    analyticsToDelete.filter(value => value !== analytics).forEach(value => {
        const elt = document.getElementById(value);
        elt?.remove();
    });

    if (document.getElementById(analytics) === null) {
        const matomoUrl = process.env.NEXT_PUBLIC_MATOMO_URL;
        const matomoSiteId = process.env.NEXT_PUBLIC_MATOMO_SITE_ID;
        const env = process.env.NODE_ENV;
        let trackingUrl = window?.location?.href;

        console.debug('matomoUrl :', matomoUrl);
        console.debug('matomoSiteId :', matomoSiteId);
        console.debug('env :', env);

        var _paq = (window._paq = window._paq || []);
        _paq.push(['setCustomUrl', trackingUrl]);
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
            g.id = analytics;
            s?.parentNode?.insertBefore(g, s);
        })();
    }
}
