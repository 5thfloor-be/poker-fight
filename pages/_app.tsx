import "../styles/globals.css";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import LayoutActive from "../components/LayoutActive";
import LayoutNonActive from "../components/LayoutNonActive";

function MyApp({ Component, pageProps }: AppProps) {
  const [isRoomActive, setIsRoomActive] = useState(true);

  return (
    <>
      {isRoomActive ? (
        <LayoutActive>
          <Component {...pageProps} />
        </LayoutActive>
      ) : (
        <LayoutNonActive>
          <Component {...pageProps} />
        </LayoutNonActive>
      )}
    </>
  );
}

export default MyApp;
