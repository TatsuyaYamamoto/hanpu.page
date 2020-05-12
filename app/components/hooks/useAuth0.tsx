import React, { useEffect, useContext, useCallback, FC } from "react";
import { useRouter } from "next/router";

import createAuth0Client, {
  Auth0ClientOptions,
  IdToken,
  RedirectLoginOptions
} from "@auth0/auth0-spa-js";
import Auth0Client from "@auth0/auth0-spa-js/dist/typings/Auth0Client";
import { parse as parseQuery } from "querystring";

import { useAssignableState } from "../../utils/hooks";

export type Auth0User = Auth0TwitterUser;

export interface Auth0TwitterUser {
  /**
   * twitterの表示名
   */
  nickname: string;

  /**
   * こっちもtwitterの表示名。screen_nameじゃないので、注意
   * https://community.auth0.com/t/twitter-nickname-is-not-the-same-as-screen-name/17297/3
   */
  name: string;

  /**
   * アイコン画像URL
   */
  picture: string;
  updated_at: string;
  sub: string;
}

interface IAuth0Context {
  initialized: boolean;
  user?: Auth0TwitterUser;
  auth0Client?: Auth0Client;
  idToken?: string;
}

export const Auth0Context = React.createContext<IAuth0Context>({} as any);

interface Auth0ProviderProps {
  auth0ClientOptions: Auth0ClientOptions;
}

const log = (message?: any, ...optionalParams: any[]): void => {
  // tslint:disable-next-line
  console.log(`[useAuth0] ${message}`, ...optionalParams);
};

export const Auth0Provider: FC<Auth0ProviderProps> = props => {
  const { children, auth0ClientOptions } = props;

  const router = useRouter();
  const [contextValue, assignContextValue] = useAssignableState<IAuth0Context>({
    initialized: false
  });

  useEffect(() => {
    (async () => {
      const auth0Client = await createAuth0Client(auth0ClientOptions);
      assignContextValue({ auth0Client });
      log("auth0 client is created.");

      const query = parseQuery(
        window.location.search.trim().replace(/^[?#&]/, "")
      );
      const { code, state, ...otherQueries } = query;
      const isAuth0Redirected = !!code && !!state;
      if (isAuth0Redirected) {
        await auth0Client
          .handleRedirectCallback()
          .then(result => {
            log("this access is redirect. handle redirect callback.", result);
          })
          .catch(() => {
            // prettier-ignore
            // tslint:disable-next-line
            console.log("location.search has invalid code or state of auth0. remove them.");
          });

        router.replace({
          pathname: window.location.pathname,
          query: otherQueries
        });
      }

      const isAuthenticated = await auth0Client.isAuthenticated();

      if (isAuthenticated) {
        const [user, idTokenClaims] = await Promise.all<
          Auth0TwitterUser,
          IdToken
        >([auth0Client.getUser(), auth0Client.getIdTokenClaims()]);

        assignContextValue({ user, idToken: idTokenClaims.__raw });
        log(`client is authenticated. uid: ${user.sub}`);
      }

      assignContextValue({ initialized: true });
      log(`client is initialized.`);
    })().catch(e => {
      // TODO
      // tslint:disable-next-line
      console.error("fail initializing auth0", e);
    });
  }, []);

  return (
    <Auth0Context.Provider value={contextValue}>
      {children}
    </Auth0Context.Provider>
  );
};

const useAuth0 = () => {
  const { user, initialized, auth0Client, idToken } = useContext(Auth0Context);

  const loginWithRedirect = useCallback(
    async (options: RedirectLoginOptions = {}) => {
      if (auth0Client) {
        const { origin, href } = location;

        await auth0Client.loginWithRedirect({
          ...options,
          redirect_uri: `${origin}/callback?to=${href}`
        });
      }
    },
    [auth0Client]
  );

  const logout = useCallback(
    (returnTo?: string) => {
      if (auth0Client) {
        auth0Client.logout({ returnTo });
      }
    },
    [auth0Client]
  );

  return {
    user,
    initialized,
    idToken,
    loginWithRedirect,
    logout
  };
};

export default useAuth0;