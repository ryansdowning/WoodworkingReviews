import { isLoggedIn } from "../utilities/authentication";
import { makeRequest } from "../utilities/networking";
import { Member } from "../utilities/types/accounts";
import { User } from "../utilities/types/base";
import { PUBLIC_URLS, URL_ROOT } from "../utilities/urls";
import { MantineProvider, ColorScheme, ColorSchemeProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { getCookie, setCookie } from "cookies-next";
import NextApp, { AppProps, AppContext } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext<[User | undefined, Member | undefined]>([undefined, undefined]);

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const router = useRouter();
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);
  const [user, setUser] = useState<User>();
  const [member, setMember] = useState<Member>();

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    setCookie("mantine-color-scheme", nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  };

  useEffect(() => {
    if (isLoggedIn() && !user) {
      makeRequest("GET", URL_ROOT, "auth/user/me/", {}, true)
        ?.then(setUser)
        .then(() => makeRequest("GET", URL_ROOT, "accounts/member/me/", {}, true)?.then(setMember));
    }
  });
  useEffect(() => {
    if (!PUBLIC_URLS.some((publicUrl) => router.route.match(publicUrl)) && !user) {
      router.push("/login");
    }
  }, [router.pathname]);

  return (
    <UserContext.Provider value={[user, member]}>
      <Head>
        <title>Mantine next example</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>

      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
          <NotificationsProvider>
            <Component {...pageProps} />
          </NotificationsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </UserContext.Provider>
  );
}

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  return {
    ...appProps,
    colorScheme: getCookie("mantine-color-scheme", appContext.ctx) || "dark",
  };
};
