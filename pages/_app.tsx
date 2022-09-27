import "../styles/globals.css";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import LayoutActive from "../components/LayoutActive";
import LayoutNonActive from "../components/LayoutNonActive";
import { getStorageValue } from "../components/UseLocalStorage";

function MyApp({ Component, pageProps }: AppProps) {
  const [isRoomActive, setIsRoomActive] = useState(false);

  const user = getStorageValue("USER", {
    username: "",
    color: "#ffffff",
  });

  return (
    <>
      {isRoomActive ? (
        <LayoutActive user={user}>
          <Component {...pageProps} />
        </LayoutActive>
      ) : (
        <LayoutNonActive user={user}>
          <Component {...pageProps} />
        </LayoutNonActive>
      )}
    </>
  );
}

export default MyApp;