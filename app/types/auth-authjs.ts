import { Ref } from 'vue';
// import type { AuthAction, Session as OAuthSession } from '@auth/core/types';

import {
  AuthInstance,
  CredentialsUser,
  EmailUser,
  GithubUser,
  LoginOptions,
  Session,
  User,
} from './auth';

export { NextAuthInstance };

interface NextAuthInstance extends AuthInstance {
  authLoading: Ref<boolean>;
  authError: Ref<any>;
  isLoggedIn: Ref<boolean>;
  user?: Ref<User | undefined>;
  githubUser?: Ref<GithubUser | undefined>;
  authState?: Ref<string>;
  nonce?: Ref<string>;
  session?: Ref<Session | undefined>;
  idToken?: Ref<string>;
  accessToken?: Ref<string>;
  loginRedirectPath?: Ref<string>;
  // popupOpen: Ref<boolean>;

  onLoad: () => Promise<void>;
  login(options: LoginOptions): Promise<void>;
  logout(options?: any): Promise<void>;
  setSession: (_session?: Session | string) => Promise<Session | undefined>;
  setSessionAuthStore: (session: Session | undefined) => void;
  setSessionToken: (token: string) => void;
  setLoggedIn: (loggedIn: boolean) => void;
  setCurrentUser: (user: User | undefined) => void;
  setAccessToken?: (token: string) => void;
  setNonce?: (nonce: string) => void;
  setAuthState?: (state: string) => void;
  setLoginRedirectPath?: (path: string) => void;
  setIdToken?: (token: string) => void;

  // createAuthClient: (
  //   onRedirectCallback: (appState: any) => void,
  //   redirect_uri?: string,
  //   options?: ClientOptions,
  // ) => Promise<void>;
  // isAuthenticated: () => Promise<boolean>;
  // loginWithPopup(o?: PopupLoginOptions): Promise<void>;
  // handleRedirectCallback(url?: string): Promise<RedirectLoginResult>;
  // loginWithRedirect(o?: RedirectLoginOptions): Promise<void>;
  // getTokenSilently(options?: GetTokenSilentlyOptions): Promise<string>;
  // getTokenSilently(
  //   options: GetTokenSilentlyOptions & { detailedResponse: true },
  // ): Promise<GetTokenSilentlyVerboseResponse>;
  // getIdTokenClaims(): Promise<IdToken | undefined>;
  // getTokenWithPopup(o?: GetTokenWithPopupOptions): Promise<string | undefined>;
}

// interface Auth0Instance {
//   $auth: this;
// }
